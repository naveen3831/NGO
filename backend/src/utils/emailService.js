import nodemailer from 'nodemailer';
import WebsiteContent from '../models/WebsiteContent.js';

const DEFAULT_ORG_NAME = 'Godhavari Nadhi Paryavarana Parishubratha';
const DEFAULT_TAGLINE =
  'Dedicated to the cleanliness, ecological revival, and purity of the sacred River Godavari';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Fetch latest organization branding (orgName, logoUrl, contactInfo) from WebsiteContent.
 */
export const getBrandingConfig = async () => {
  try {
    const content = await WebsiteContent.findOne().lean();
    return {
      orgName: content?.orgName?.trim() || DEFAULT_ORG_NAME,
      tagline: content?.tagline?.trim() || DEFAULT_TAGLINE,
      logoUrl: content?.logoUrl?.trim() || '',
      contactEmail:
        content?.contactInfo?.email?.trim() || process.env.SMTP_USER || 'contact@godhavari.org',
      contactPhone: content?.contactInfo?.phone?.trim() || '+91 883 245 7890',
    };
  } catch (err) {
    console.warn('Could not load WebsiteContent branding for email:', err.message);
    return {
      orgName: DEFAULT_ORG_NAME,
      tagline: DEFAULT_TAGLINE,
      logoUrl: '',
      contactEmail: process.env.SMTP_USER || 'contact@godhavari.org',
      contactPhone: '+91 883 245 7890',
    };
  }
};

const resolveLogoForEmail = (logoUrl) => {
  if (!logoUrl) {
    return { logoSrc: '', attachments: [] };
  }

  // Support base64 data URIs uploaded from Admin Website Content via CID inline attachment
  const dataUriMatch = logoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (dataUriMatch) {
    const mimeType = dataUriMatch[1];
    const ext = mimeType.split('/')[1]?.replace(/[^a-zA-Z0-9]/g, '') || 'png';
    return {
      logoSrc: 'cid:ngo-org-logo',
      attachments: [
        {
          filename: `logo.${ext}`,
          content: Buffer.from(dataUriMatch[2], 'base64'),
          cid: 'ngo-org-logo',
          contentType: mimeType,
        },
      ],
    };
  }

  if (/^https?:\/\//i.test(logoUrl)) {
    return { logoSrc: logoUrl, attachments: [] };
  }

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5174').replace(/\/+$/, '');
  if (logoUrl.startsWith('/')) {
    return { logoSrc: `${clientUrl}${logoUrl}`, attachments: [] };
  }

  return { logoSrc: '', attachments: [] };
};

const createTransporter = () => {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) {
    console.warn('SMTP credentials are not configured; skipping email send.');
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const buildBrandedEmailHtml = ({ branding, logoSrc, badgeText, badgeBg, badgeColor, heading, bodyHtml }) => {
  const safeOrgName = escapeHtml(branding.orgName);
  const safeTagline = escapeHtml(branding.tagline);
  const initials = branding.orgName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'GN';

  const logoBlock = logoSrc
    ? `<img src="${escapeHtml(logoSrc)}" alt="${safeOrgName}" style="width:48px;height:48px;object-fit:contain;border-radius:10px;background:#ffffff;padding:4px;display:block;" />`
    : `<div style="width:48px;height:48px;border-radius:10px;background:#ffffff;color:#006B3C;font-weight:800;font-size:18px;line-height:48px;text-align:center;">${escapeHtml(initials)}</div>`;

  return `
    <div style="margin:0;padding:24px;background-color:#f8fafc;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 8px 24px rgba(15,23,42,0.06);">
        <div style="background:linear-gradient(135deg,#064e3b 0%,#006B3C 100%);padding:22px 28px;color:#ffffff;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="58" valign="middle">${logoBlock}</td>
              <td valign="middle" style="padding-left:12px;">
                <div style="font-size:18px;font-weight:800;line-height:1.25;color:#ffffff;">${safeOrgName}</div>
                <div style="font-size:12px;color:#d1fae5;margin-top:3px;line-height:1.35;">${safeTagline}</div>
              </td>
            </tr>
          </table>
        </div>

        <div style="padding:28px;">
          <span style="display:inline-block;background:${badgeBg};color:${badgeColor};padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;letter-spacing:0.03em;margin-bottom:14px;">
            ${escapeHtml(badgeText)}
          </span>
          <h2 style="margin:0 0 14px;font-size:21px;font-weight:800;color:#064e3b;line-height:1.3;">
            ${escapeHtml(heading)}
          </h2>
          ${bodyHtml}
        </div>

        <div style="background:#f0fdf4;border-top:1px solid #d1fae5;padding:16px 28px;font-size:12px;color:#475569;line-height:1.6;">
          <strong style="color:#064e3b;">${safeOrgName}</strong><br />
          Email: ${escapeHtml(branding.contactEmail)} &bull; Phone: ${escapeHtml(branding.contactPhone)}
        </div>
      </div>
    </div>
  `;
};

const sendBrandedMail = async ({ to, subject, badgeText, badgeBg, badgeColor, heading, bodyHtml }) => {
  if (!to) return false;
  const transporter = createTransporter();
  if (!transporter) return false;

  const branding = await getBrandingConfig();
  const { logoSrc, attachments } = resolveLogoForEmail(branding.logoUrl);
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const html = buildBrandedEmailHtml({
    branding,
    logoSrc,
    badgeText,
    badgeBg,
    badgeColor,
    heading,
    bodyHtml,
  });

  try {
    await transporter.sendMail({
      from: `"${branding.orgName}" <${fromEmail}>`,
      to,
      subject: `${subject} | ${branding.orgName}`,
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return false;
  }
};

export const sendRegistrationEmail = async ({ to, name, memberId, membershipType, isVolunteer }) => {
  const roleLabel = isVolunteer ? 'Volunteer' : 'Member';
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
      Dear <strong>${escapeHtml(name)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;">
      Thank you for registering as a <strong>${roleLabel}</strong>. Your application has been received and is currently <strong>Pending</strong> verification by our administrator.
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;margin-bottom:18px;font-size:14px;line-height:1.8;">
      <div><strong>${isVolunteer ? 'Volunteer ID' : 'Member ID'}:</strong> ${escapeHtml(memberId)}</div>
      <div><strong>Category:</strong> ${escapeHtml(membershipType)}</div>
      <div><strong>Current Status:</strong> Pending Review</div>
    </div>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
      You will receive another email as soon as our team reviews and approves your registration.
    </p>
  `;

  return sendBrandedMail({
    to,
    subject: `${roleLabel} Registration Received (${memberId})`,
    badgeText: `${roleLabel.toUpperCase()} REGISTRATION`,
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    heading: `Welcome, ${name}!`,
    bodyHtml,
  });
};

export const sendApprovalEmail = async ({ to, name, memberId, membershipType, validTo }) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5174').replace(/\/+$/, '');
  const isVolunteer = membershipType === 'Volunteer Member';
  const validLabel = validTo ? new Date(validTo).toLocaleDateString('en-IN') : 'Active';

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
      Dear <strong>${escapeHtml(name)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;">
      Great news! Your ${isVolunteer ? 'volunteer' : 'membership'} registration has been verified and <strong>Approved</strong>. Your account is now <strong>Active</strong>.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 18px;margin-bottom:18px;font-size:14px;line-height:1.8;">
      <div><strong>${isVolunteer ? 'Volunteer ID' : 'Member ID'}:</strong> ${escapeHtml(memberId)}</div>
      <div><strong>Category:</strong> ${escapeHtml(membershipType)}</div>
      <div><strong>Status:</strong> Active &amp; Approved</div>
      <div><strong>Valid Until:</strong> ${escapeHtml(validLabel)}</div>
    </div>
    <a href="${escapeHtml(clientUrl)}/login" style="display:inline-block;background:#008C4A;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:8px;">
      Sign In to Member Portal
    </a>
  `;

  return sendBrandedMail({
    to,
    subject: `Registration Approved (${memberId})`,
    badgeText: 'APPROVED & ACTIVE',
    badgeBg: '#dcfce7',
    badgeColor: '#166534',
    heading: 'Your Registration Has Been Approved!',
    bodyHtml,
  });
};

export const sendRejectionEmail = async ({ to, name, memberId, membershipType, reason }) => {
  const safeReason = reason?.trim() || 'Details could not be verified by the administrator.';
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
      Dear <strong>${escapeHtml(name)}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#334155;">
      Thank you for your interest. After reviewing your details, your ${membershipType === 'Volunteer Member' ? 'volunteer' : 'membership'} registration (<strong>${escapeHtml(memberId)}</strong>) was not approved at this time.
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:14px 18px;margin-bottom:18px;font-size:14px;line-height:1.65;color:#991b1b;">
      <strong>Reason for Rejection:</strong><br />
      ${escapeHtml(safeReason)}
    </div>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
      If you believe this was a mistake or would like to update your details, please reach out to our secretariat team.
    </p>
  `;

  return sendBrandedMail({
    to,
    subject: `Registration Update (${memberId})`,
    badgeText: 'APPLICATION REJECTED',
    badgeBg: '#fee2e2',
    badgeColor: '#991b1b',
    heading: 'Registration Not Approved',
    bodyHtml,
  });
};

export const sendBrandingUpdatedEmail = async ({ to, updatedByName }) => {
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
      Hello <strong>${escapeHtml(updatedByName || 'Administrator')}</strong>,
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#334155;">
      Your organization branding (logo and organization name) has been updated. All future registration, approval, and rejection emails will automatically use the updated branding shown in this email header and footer.
    </p>
  `;

  return sendBrandedMail({
    to,
    subject: 'Branding & Logo Updated',
    badgeText: 'BRANDING UPDATED',
    badgeBg: '#e0f2fe',
    badgeColor: '#075985',
    heading: 'Organization Branding Updated',
    bodyHtml,
  });
};
