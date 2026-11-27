import React, { useState, useEffect } from 'react';
import {
  Users,
  Droplets,
  Calendar,
  Phone,
  MapPin,
  User as UserIcon,
  Check,
} from 'lucide-react';

export const DEFAULT_ORG_NAME = 'Godhavari Nadhi Paryavarana Parishubratha';
export const DEFAULT_SLOGAN = 'Clean Rivers... Green Future...';
export const DEFAULT_TAGLINE = 'Regd. Society #45/2018 • Est. 2018';
const STOCK_PLACEHOLDER_FRAGMENT = 'photo-1535713875002-d1d0cf377fde';

export const hasCustomPortrait = (avatar) =>
  Boolean(avatar && typeof avatar === 'string' && avatar.trim() && !avatar.includes(STOCK_PLACEHOLDER_FRAGMENT));

export const getInitials = (name, fallback = 'M') => {
  if (!name || !name.trim()) return fallback.charAt(0).toUpperCase();
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatValidUntil = (validTo) => {
  if (!validTo) return 'Lifetime';
  const d = new Date(validTo);
  if (Number.isNaN(d.getTime())) return 'Lifetime';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Splits org name cleanly into balanced lines matching the card header proportions.
 */
const splitOrgLines = (orgName, maxCharsPerLine = 28) => {
  const words = (orgName || DEFAULT_ORG_NAME).trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};

/* ─── Exact Vector NGO Logo (matches Logo.jsx emblem 100x100) ─────────── */
const NgoVectorLogo = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path
      d="M50 7C55 15 80 26 80 54C80 62 77 69 72 74L28 74C23 69 20 62 20 54C20 26 45 15 50 7Z"
      fill="#52b748"
    />
    <path
      d="M50 20C53 26 57 32 61 36C65 37 68 41 68 46C72 48 73 54 71 61C69 66 64 70 50 70C36 70 31 66 29 61C27 54 28 48 32 46C32 41 35 37 39 36C43 32 47 26 50 20Z"
      fill="#ffffff"
    />
    <path
      d="M50 31C58 40 61 49 60 57C59 63 55 66 50 67C45 66 41 63 40 57C39 49 42 40 50 31Z"
      fill="#15803d"
    />
    <path d="M50 36V65" stroke="#86efac" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M7 66C24 61 42 66 58 75C65 79 71 80 76 79C62 84 42 82 24 75C15 71 9 68 7 66Z"
      fill="#38bdf8"
    />
    <path
      d="M93 66C76 61 58 66 42 75C35 79 29 80 24 79C38 84 58 82 76 75C85 71 91 68 93 66Z"
      fill="#0ea5e9"
    />
    <path
      d="M19 76C33 77 45 81 50 84C55 81 67 77 81 76C74 87 63 93 50 93C37 93 26 87 19 76Z"
      fill="#0284c7"
    />
  </svg>
);

/* ─── Canvas Drawing Helpers (Matched to HTML Preview) ────────────────── */
const loadImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/**
 * Draw the exact NGO Logo.jsx emblem scaled inside a box at (x, y, size) on Canvas.
 */
const drawVectorLogoOnCanvas = (ctx, x, y, size) => {
  const s = size / 100;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  const p1 = new Path2D('M50 7C55 15 80 26 80 54C80 62 77 69 72 74L28 74C23 69 20 62 20 54C20 26 45 15 50 7Z');
  ctx.fillStyle = '#52b748';
  ctx.fill(p1);

  const p2 = new Path2D('M50 20C53 26 57 32 61 36C65 37 68 41 68 46C72 48 73 54 71 61C69 66 64 70 50 70C36 70 31 66 29 61C27 54 28 48 32 46C32 41 35 37 39 36C43 32 47 26 50 20Z');
  ctx.fillStyle = '#ffffff';
  ctx.fill(p2);

  const p3 = new Path2D('M50 31C58 40 61 49 60 57C59 63 55 66 50 67C45 66 41 63 40 57C39 49 42 40 50 31Z');
  ctx.fillStyle = '#15803d';
  ctx.fill(p3);

  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(50, 36);
  ctx.lineTo(50, 65);
  ctx.stroke();

  const p4 = new Path2D('M7 66C24 61 42 66 58 75C65 79 71 80 76 79C62 84 42 82 24 75C15 71 9 68 7 66Z');
  ctx.fillStyle = '#38bdf8';
  ctx.fill(p4);

  const p5 = new Path2D('M93 66C76 61 58 66 42 75C35 79 29 80 24 79C38 84 58 82 76 75C85 71 91 68 93 66Z');
  ctx.fillStyle = '#0ea5e9';
  ctx.fill(p5);

  const p6 = new Path2D('M19 76C33 77 45 81 50 84C55 81 67 77 81 76C74 87 63 93 50 93C37 93 26 87 19 76Z');
  ctx.fillStyle = '#0284c7';
  ctx.fill(p6);

  ctx.restore();
};

/**
 * Draw crisp mini monochrome dark-green icons on Canvas for each of the 6 grid cells.
 */
const drawFieldIconOnCanvas = (ctx, type, x, y, size = 22) => {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 24;
  ctx.scale(s, s);
  ctx.fillStyle = '#14532d';
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'tier') {
    // Users silhouette
    ctx.beginPath();
    ctx.arc(9, 7, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16.5, 8.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(2, 20);
    ctx.quadraticCurveTo(2, 14, 9, 14);
    ctx.quadraticCurveTo(16, 14, 16, 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(15, 19);
    ctx.quadraticCurveTo(15, 14.5, 18.5, 14.5);
    ctx.quadraticCurveTo(22, 14.5, 22, 19);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'blood') {
    const p = new Path2D('M12 2.5C12 2.5 5 10.5 5 15.2C5 19.2 8.1 22 12 22C15.9 22 19 19.2 19 15.2C19 10.5 12 2.5 12 2.5Z');
    ctx.fill(p);
  } else if (type === 'calendar') {
    rr(ctx, 3, 4.5, 18, 17, 2.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(8, 2.5); ctx.lineTo(8, 6);
    ctx.moveTo(16, 2.5); ctx.lineTo(16, 6);
    ctx.moveTo(3, 9.5); ctx.lineTo(21, 9.5);
    ctx.stroke();
    ctx.fillRect(7, 13, 3, 3);
    ctx.fillRect(14, 13, 3, 3);
  } else if (type === 'phone') {
    const p = new Path2D('M21 16.5v3a2 2 0 0 1-2.18 2 19.7 19.7 0 0 1-8.57-3.07 19.5 19.5 0 0 1-6-6A19.7 19.7 0 0 1 1.18 3.82 2 2 0 0 1 3.16 1.6h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.14 9.51a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21 16.5z');
    ctx.stroke(p);
  } else if (type === 'city') {
    const p = new Path2D('M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z');
    ctx.fill(p);
    ctx.fillStyle = '#f6fbf7';
    ctx.beginPath();
    ctx.arc(12, 9, 2.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(12, 7.5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, 21);
    ctx.quadraticCurveTo(4, 14, 12, 14);
    ctx.quadraticCurveTo(20, 14, 20, 21);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

/**
 * Generates and downloads a 1200x754 PNG matching the OfficialIdCard design pixel-for-pixel.
 */
export const downloadOfficialIdCard = async ({ user, membership, branding }) => {
  const W = 1200;
  const H = 754;
  const PW = 414; // ~34.5% left panel
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const orgName = branding?.orgName?.trim() || DEFAULT_ORG_NAME;
  const logoUrl = branding?.logoUrl?.trim() || '';
  const isVol = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVol ? 'Volunteer' : 'Member';
  const memberId = user?.memberId || 'GNPP-2026-0000';
  const category = membership?.membershipType || roleLabel;
  const status = membership?.status || 'Active';
  const isActive = status.toLowerCase() === 'active' || status.toLowerCase() === 'approved';
  const validUntil = formatValidUntil(membership?.validTo);
  const city = user?.address?.city || 'Rajahmundry';

  // Outer card clip
  ctx.save();
  rr(ctx, 0, 0, W, H, 36);
  ctx.clip();

  // White right panel base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Left deep forest green panel
  const leftGrad = ctx.createLinearGradient(0, 0, PW, H);
  leftGrad.addColorStop(0, '#074e2a');
  leftGrad.addColorStop(0.55, '#054423');
  leftGrad.addColorStop(1, '#03331a');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, PW, H);

  // Subtle lime corner diagonal swoosh at bottom-right of green panel
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(PW - 170, H);
  ctx.quadraticCurveTo(PW - 65, H - 40, PW, H - 110);
  ctx.lineTo(PW, H);
  ctx.closePath();
  const limeGrad = ctx.createLinearGradient(PW - 140, H, PW, H - 110);
  limeGrad.addColorStop(0, '#36a829');
  limeGrad.addColorStop(1, '#58c92a');
  ctx.fillStyle = limeGrad;
  ctx.globalAlpha = 0.72;
  ctx.fill();
  ctx.restore();

  // Botanical eco leaves in bottom-left corner of left panel
  ctx.save();
  ctx.translate(14, H - 175);
  ctx.scale(1.35, 1.35);
  // Tall upright leaf
  ctx.fillStyle = 'rgba(72, 168, 72, 0.42)';
  const leaf1 = new Path2D('M15 118 C6 82, 8 36, 18 6 C46 34, 58 76, 46 118 Z');
  ctx.fill(leaf1);
  ctx.strokeStyle = 'rgba(18, 92, 34, 0.65)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(30, 120);
  ctx.quadraticCurveTo(26, 65, 18, 12);
  ctx.stroke();

  // Smaller slanted leaf
  ctx.fillStyle = 'rgba(84, 182, 74, 0.46)';
  const leaf2 = new Path2D('M48 122 C54 88, 76 62, 114 52 C106 90, 86 114, 48 122 Z');
  ctx.fill(leaf2);
  ctx.beginPath();
  ctx.moveTo(48, 122);
  ctx.quadraticCurveTo(78, 92, 110, 56);
  ctx.stroke();
  ctx.restore();

  // Top curved white header badge inside left green panel
  // Mint crescent accent slightly below the white wave
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(14, 152);
  ctx.quadraticCurveTo(14, 184, 92, 186);
  ctx.lineTo(PW, 180);
  ctx.lineTo(PW, 165);
  ctx.quadraticCurveTo(190, 178, 92, 178);
  ctx.quadraticCurveTo(22, 178, 14, 132);
  ctx.closePath();
  ctx.fillStyle = 'rgba(134, 239, 172, 0.48)';
  ctx.fill();
  ctx.restore();

  // White organic header card
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(92, 16);
  ctx.lineTo(PW, 16);
  ctx.lineTo(PW, 172);
  ctx.quadraticCurveTo(195, 180, 86, 178);
  ctx.quadraticCurveTo(14, 176, 14, 112);
  ctx.quadraticCurveTo(14, 16, 92, 16);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Logo inside white curved header
  const logoImg = await loadImage(logoUrl);
  if (logoImg) {
    ctx.drawImage(logoImg, 32, 34, 88, 88);
  } else {
    drawVectorLogoOnCanvas(ctx, 28, 30, 96);
  }

  // Org name & slogan inside white header
  const leftOrgLines = splitOrgLines(orgName, 17).slice(0, 3);
  ctx.fillStyle = '#113b27';
  ctx.font = '800 21px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  leftOrgLines.forEach((line, i) => {
    ctx.fillText(line, 134, 34 + i * 25);
  });

  ctx.fillStyle = '#14532d';
  ctx.font = 'italic 600 13.5px "Segoe UI", Inter, sans-serif';
  ctx.fillText(DEFAULT_SLOGAN, 134, 38 + leftOrgLines.length * 25 + 6);

  // Circular portrait rings
  const cx = PW / 2;
  const cy = 342;
  const r = 104;

  // White outer ring
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.fill();

  // Dark green gap
  ctx.fillStyle = '#054423';
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.fill();

  // Bright emerald ring
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
  ctx.fill();

  // Portrait interior clip
  const customAvatar = hasCustomPortrait(user?.avatar) ? await loadImage(user.avatar) : null;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.clip();
  if (customAvatar) {
    ctx.drawImage(customAvatar, cx - r, cy - r, r * 2, r * 2);
  } else {
    const avGrad = ctx.createRadialGradient(cx, cy - 20, 12, cx, cy, r);
    avGrad.addColorStop(0, '#f0fdf4');
    avGrad.addColorStop(1, '#dcfce7');
    ctx.fillStyle = avGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Subtle silhouette behind initials
    ctx.fillStyle = 'rgba(6, 78, 59, 0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy - 22, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 72, 66, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#064e3b';
    ctx.font = '800 66px "Segoe UI", Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getInitials(user?.name, roleLabel), cx, cy + 4);
  }
  ctx.restore();

  // Member name below portrait
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 30px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const displayName = (user?.name || roleLabel).toUpperCase();
  ctx.fillText(displayName.length > 20 ? `${displayName.slice(0, 18)}…` : displayName, cx, 474);

  // Designation
  ctx.fillStyle = '#f0fdf4';
  ctx.font = '600 19px "Segoe UI", Inter, sans-serif';
  const desig = user?.designation || 'General Member';
  ctx.fillText(desig.length > 26 ? `${desig.slice(0, 24)}…` : desig, cx, 514);

  // ACTIVE pill button with white outline + white checkmark circle
  const pillW = 190;
  const pillH = 48;
  const pillX = cx - pillW / 2;
  const pillY = 556;

  ctx.fillStyle = isActive ? '#228b38' : '#b91c1c';
  rr(ctx, pillX, pillY, pillW, pillH, 24);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // White check circle inside pill
  const chkX = pillX + 38;
  const chkY = pillY + pillH / 2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(chkX, chkY, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isActive ? '#1f8f34' : '#b91c1c';
  ctx.lineWidth = 2.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(chkX - 5, chkY);
  ctx.lineTo(chkX - 1, chkY + 4);
  ctx.lineTo(chkX + 6, chkY - 4);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 18px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(status.toUpperCase(), chkX + 20, chkY + 1);

  /* ══ RIGHT WHITE PANEL ═════════════════════════════════════════════ */
  const rx = PW + 38;
  const rightMargin = 38;
  const rw = W - rx - rightMargin;

  // ID Chip top-right
  const chipW = 228;
  const chipH = 52;
  const chipX = W - rightMargin - chipW;
  const chipY = 34;
  ctx.fillStyle = '#d4ecd1';
  ctx.strokeStyle = '#9ad09a';
  ctx.lineWidth = 2;
  rr(ctx, chipX, chipY, chipW, chipH, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#124129';
  ctx.font = '700 20px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(memberId, chipX + chipW / 2, chipY + chipH / 2 + 1);

  // Org Name top-left of right panel
  const rightOrgLines = splitOrgLines(orgName, 29).slice(0, 2);
  ctx.fillStyle = '#124129';
  ctx.font = '800 28px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  rightOrgLines.forEach((line, i) => {
    ctx.fillText(line, rx, 34 + i * 33);
  });

  ctx.fillStyle = '#1e293b';
  ctx.font = '500 17.5px "Segoe UI", Inter, sans-serif';
  ctx.fillText(DEFAULT_TAGLINE, rx, 36 + rightOrgLines.length * 33 + 6);

  // Dark green capsule banner ("OFFICIAL IDENTITY CARD")
  const bannerY = 158;
  const bannerH = 48;
  ctx.fillStyle = '#0c4f2b';
  rr(ctx, rx, bannerY, rw, bannerH, 24);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 21px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OFFICIAL IDENTITY CARD', rx + rw / 2, bannerY + bannerH / 2 + 1);

  // 2x3 detail grid
  const fields = [
    { type: 'tier', label: 'MEMBERSHIP TIER', value: category },
    { type: 'blood', label: 'BLOOD GROUP', value: user?.bloodGroup || '—' },
    { type: 'calendar', label: 'VALID UNTIL', value: validUntil },
    { type: 'phone', label: 'MOBILE', value: user?.phone || '—' },
    { type: 'city', label: 'CITY', value: city },
    { type: 'role', label: 'ROLE', value: (user?.role || roleLabel).replace(/^./, (c) => c.toUpperCase()) },
  ];

  const gap = 16;
  const colW = (rw - gap * 2) / 3;
  const rowH = 172;
  const gridY = 230;

  fields.forEach((f, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const fx = rx + col * (colW + gap);
    const fy = gridY + row * (rowH + gap);

    ctx.fillStyle = '#f6fbf7';
    ctx.strokeStyle = '#d4e6da';
    ctx.lineWidth = 1.6;
    rr(ctx, fx, fy, colW, rowH, 16);
    ctx.fill();
    ctx.stroke();

    drawFieldIconOnCanvas(ctx, f.type, fx + 20, fy + 20, 26);

    // Label (supports 2 lines for MEMBERSHIP TIER just like mockup)
    ctx.fillStyle = '#14532d';
    ctx.font = '800 15px "Segoe UI", Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (f.label === 'MEMBERSHIP TIER') {
      ctx.fillText('MEMBERSHIP', fx + 54, fy + 18);
      ctx.fillText('TIER', fx + 54, fy + 36);
    } else {
      ctx.fillText(f.label, fx + 54, fy + 24);
    }

    // Value (bold black, wraps cleanly to 2 lines if needed)
    ctx.fillStyle = '#111827';
    ctx.font = '800 24px "Segoe UI", Inter, sans-serif';
    const valStr = String(f.value);
    const valY = fy + 82;
    if (ctx.measureText(valStr).width > colW - 36 && valStr.includes(' ')) {
      const parts = valStr.split(' ');
      const mid = Math.ceil(parts.length / 2);
      ctx.fillText(parts.slice(0, mid).join(' '), fx + 20, valY - 4);
      ctx.fillText(parts.slice(mid).join(' '), fx + 20, valY + 28);
    } else {
      ctx.fillText(valStr, fx + 20, valY + 6);
    }
  });

  // Flush bottom mint footer band
  const footerH = 104;
  const footerY = H - footerH;
  ctx.fillStyle = '#dff0db';
  ctx.fillRect(PW, footerY, W - PW, footerH);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#124129';
  ctx.font = '800 22px "Segoe UI", Inter, sans-serif';
  ctx.fillText('Dr. K. V. Subba Rao', rx, footerY + 26);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'italic 500 17px "Segoe UI", Inter, sans-serif';
  ctx.fillText('President & Chief Coordinator', rx, footerY + 56);

  // Vertical divider line
  const divX = W - 295;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(divX, footerY + 28);
  ctx.lineTo(divX, footerY + 76);
  ctx.stroke();

  // Verified pass circle & label
  const vx = divX + 52;
  const vy = footerY + footerH / 2;
  ctx.fillStyle = '#2eb82e';
  ctx.beginPath();
  ctx.arc(vx, vy, 21, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(vx - 8, vy + 1);
  ctx.lineTo(vx - 2, vy + 7);
  ctx.lineTo(vx + 9, vy - 6);
  ctx.stroke();

  ctx.fillStyle = '#111827';
  ctx.font = '800 20px "Segoe UI", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('VERIFIED PASS', vx + 32, vy + 1);

  ctx.restore();

  const link = document.createElement('a');
  link.download = `${memberId}-id-card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/* ─── Interactive Visual ID Card Component ──────────────────────────────── */
const OfficialIdCard = ({ user, membership, branding }) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [user?.avatar]);

  const orgName = branding?.orgName?.trim() || DEFAULT_ORG_NAME;
  const logoUrl = branding?.logoUrl?.trim() || '';
  const isVol = user?.role?.toLowerCase() === 'volunteer';
  const roleLabel = isVol ? 'Volunteer' : 'Member';
  const memberId = user?.memberId || 'GNPP-2026-0000';
  const category = membership?.membershipType || user?.membershipType || roleLabel;
  const status = membership?.status || 'Active';
  const isActive = status.toLowerCase() === 'active' || status.toLowerCase() === 'approved';
  const validUntil = formatValidUntil(membership?.validTo);
  const city = user?.address?.city || 'Rajahmundry';

  const leftOrgLines = splitOrgLines(orgName, 17).slice(0, 3);
  const rightOrgLines = splitOrgLines(orgName, 30).slice(0, 2);
  const showPortraitImg = hasCustomPortrait(user?.avatar) && !imgFailed;

  const fields = [
    {
      icon: Users,
      labelTop: 'MEMBERSHIP',
      labelBottom: 'TIER',
      value: category,
    },
    {
      icon: Droplets,
      label: 'BLOOD GROUP',
      value: user?.bloodGroup || '—',
    },
    {
      icon: Calendar,
      label: 'VALID UNTIL',
      value: validUntil,
    },
    {
      icon: Phone,
      label: 'MOBILE',
      value: user?.phone || '—',
    },
    {
      icon: MapPin,
      label: 'CITY',
      value: city,
    },
    {
      icon: UserIcon,
      label: 'ROLE',
      value: (user?.role || roleLabel).replace(/^./, (c) => c.toUpperCase()),
    },
  ];

  return (
    <div className="official-id-card-scroll">
      <div className="official-id-card-shell">
        {/* ══ LEFT FOREST GREEN PANEL ═══════════════════════════════════════ */}
        <div
          style={{
            width: '34.5%',
            minWidth: '275px',
            background: 'linear-gradient(165deg, #074e2a 0%, #054423 58%, #03331a 100%)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '26px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Curved Top White Header Backdrop + Mint Crescent Accent */}
          <svg
            aria-hidden="true"
            viewBox="0 0 345 155"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '155px',
              pointerEvents: 'none',
            }}
          >
            {/* Mint curved shadow edge beneath white arch */}
            <path
              d="M12 110 Q12 152 78 152 L345 147 L345 137 Q165 146 78 144 Q18 144 12 96 Z"
              fill="rgba(134, 239, 172, 0.45)"
            />
            {/* Main white organic top header wave */}
            <path
              d="M78 12 L345 12 L345 140 Q165 147 72 145 Q12 143 12 90 Q12 12 78 12 Z"
              fill="#ffffff"
            />
          </svg>

          {/* Header Content inside Curved White Shape */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '142px',
              padding: '20px 14px 14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '66px',
                height: '66px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={orgName}
                  style={{ width: '62px', height: '62px', objectFit: 'contain', borderRadius: '8px' }}
                />
              ) : (
                <NgoVectorLogo size={66} />
              )}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  color: '#113b27',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                }}
              >
                {leftOrgLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <div
                style={{
                  color: '#14532d',
                  fontSize: '0.6rem',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {DEFAULT_SLOGAN}
              </div>
            </div>
          </div>

          {/* Lime Corner Diagonal Curve (bottom-right of left panel) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 140 90"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '130px',
              height: '86px',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <linearGradient id="limeCornerWave" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#36a829" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#58c92a" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path d="M0 90 Q80 56 140 0 L140 90 Z" fill="url(#limeCornerWave)" />
          </svg>

          {/* Eco Leaves Illustration (bottom-left of left panel) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 130 130"
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '8px',
              width: '112px',
              height: '112px',
              pointerEvents: 'none',
            }}
          >
            <path
              d="M15 118 C6 82, 8 36, 18 6 C46 34, 58 76, 46 118 Z"
              fill="rgba(72, 168, 72, 0.42)"
            />
            <path
              d="M30 120 Q26 65 18 12"
              stroke="rgba(18, 92, 34, 0.65)"
              strokeWidth="2.2"
              fill="none"
            />
            <path
              d="M48 122 C54 88, 76 62, 114 52 C106 90, 86 114, 48 122 Z"
              fill="rgba(84, 182, 74, 0.46)"
            />
            <path
              d="M48 122 Q78 92 110 56"
              stroke="rgba(18, 92, 34, 0.65)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Circular Member Portrait with Double Green/White Frame */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: '22px',
              width: '146px',
              height: '146px',
              borderRadius: '50%',
              padding: '4px',
              background: '#ffffff',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.28)',
              flexShrink: 0,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                padding: '3px',
                background: '#054423',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid #22c55e',
                  overflow: 'hidden',
                  background: 'radial-gradient(circle at 50% 35%, #f0fdf4 0%, #dcfce7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                }}
              >
                {showPortraitImg ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || roleLabel}
                    onError={() => setImgFailed(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 100"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}
                    >
                      <circle cx="50" cy="36" r="18" fill="#064e3b" />
                      <path d="M16 96 C16 68, 84 68, 84 96 Z" fill="#064e3b" />
                    </svg>
                    <span
                      style={{
                        position: 'relative',
                        fontSize: '2.75rem',
                        fontWeight: 800,
                        color: '#064e3b',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {getInitials(user?.name, roleLabel)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Name, Designation & Active Pill */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              marginTop: '14px',
              padding: '0 14px',
            }}
          >
            <div
              style={{
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.03em',
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {(user?.name || roleLabel).toUpperCase()}
            </div>
            <div
              style={{
                color: '#f0fdf4',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginTop: '3px',
              }}
            >
              {user?.designation || 'General Member'}
            </div>

            <div
              style={{
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: isActive
                  ? 'linear-gradient(180deg, #2fb344 0%, #1f8f34 100%)'
                  : 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                border: '2px solid #ffffff',
                borderRadius: '9999px',
                padding: '5px 18px',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.22)',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: isActive ? '#1f8f34' : '#b91c1c',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span>{status.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT WHITE PANEL ═════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            minWidth: 0,
          }}
        >
          <div style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Top Header Row: Org Name + ID Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    color: '#124129',
                    fontWeight: 800,
                    fontSize: '1.18rem',
                    lineHeight: 1.18,
                  }}
                >
                  {rightOrgLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div
                  style={{
                    color: '#1e293b',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    marginTop: '4px',
                  }}
                >
                  {DEFAULT_TAGLINE}
                </div>
              </div>

              <div
                style={{
                  background: '#d4ecd1',
                  border: '1.5px solid #9ad09a',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  color: '#124129',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {memberId}
              </div>
            </div>

            {/* Capsule Banner */}
            <div
              style={{
                marginTop: '14px',
                background: '#0c4f2b',
                color: '#ffffff',
                borderRadius: '9999px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.84rem',
                letterSpacing: '0.09em',
                padding: '7px 14px',
              }}
            >
              OFFICIAL IDENTITY CARD
            </div>

            {/* 2×3 Details Grid */}
            <div
              style={{
                marginTop: '14px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '10px',
                flex: 1,
              }}
            >
              {fields.map((f) => {
                const Icon = f.icon;
                const key = f.label || f.labelTop;
                return (
                  <div
                    key={key}
                    style={{
                      background: '#f6fbf7',
                      border: '1px solid #d4e6da',
                      borderRadius: '11px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '86px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: f.labelTop ? 'flex-start' : 'center',
                        gap: '6px',
                        color: '#14532d',
                        fontSize: '0.67rem',
                        fontWeight: 800,
                        letterSpacing: '0.03em',
                        lineHeight: 1.15,
                      }}
                    >
                      <Icon size={15} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: f.labelTop ? '1px' : 0 }} />
                      <div>
                        {f.labelTop ? (
                          <>
                            <div>{f.labelTop}</div>
                            <div>{f.labelBottom}</div>
                          </>
                        ) : (
                          <span>{f.label}</span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        color: '#111827',
                        fontWeight: 800,
                        fontSize: '0.98rem',
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                        marginTop: '6px',
                      }}
                    >
                      {f.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flush Bottom Mint Footer Band */}
          <div
            style={{
              background: '#dff0db',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              marginTop: 'auto',
            }}
          >
            <div>
              <div
                style={{
                  color: '#124129',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                Dr. K. V. Subba Rao
              </div>
              <div
                style={{
                  color: '#1e293b',
                  fontSize: '0.73rem',
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}
              >
                President &amp; Chief Coordinator
              </div>
            </div>

            <div
              style={{
                width: '1.5px',
                height: '32px',
                background: '#1e293b',
                flexShrink: 0,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#2eb82e',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={15} strokeWidth={3.2} />
              </span>
              <span
                style={{
                  color: '#111827',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                }}
              >
                VERIFIED PASS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialIdCard;
