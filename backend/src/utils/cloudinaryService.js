import crypto from 'crypto';

const getCloudinaryConfig = () => ({
  cloudName: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  apiKey: (process.env.CLOUDINARY_API_KEY || '').trim(),
  apiSecret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
});

export const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
};

export const isCloudinaryUrl = (value) =>
  typeof value === 'string' && /^https?:\/\/res\.cloudinary\.com\//i.test(value.trim());

const signParams = (params, apiSecret) => {
  const query = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(`${query}${apiSecret}`).digest('hex');
};

/**
 * Upload a data:image/* string or remote image URL to Cloudinary and return { url, publicId }.
 */
export const uploadImageToCloudinary = async (imageInput, options = {}) => {
  if (!imageInput || typeof imageInput !== 'string') {
    return { url: '', publicId: '' };
  }

  const trimmed = imageInput.trim();
  if (!trimmed) {
    return { url: '', publicId: '' };
  }

  if (isCloudinaryUrl(trimmed)) {
    return { url: trimmed, publicId: extractCloudinaryPublicId(trimmed) };
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured in backend/.env');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder ? `godhavari-ngo/${options.folder}` : 'godhavari-ngo';

  const paramsToSign = {
    folder,
    timestamp,
    ...(options.publicId ? { public_id: options.publicId } : {}),
  };

  const signature = signParams(paramsToSign, apiSecret);

  const formData = new FormData();
  formData.append('file', trimmed);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(60000),
  });

  const payload = await response.json();
  if (!response.ok) {
    const errMsg = payload?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Cloudinary upload failed: ${errMsg}`);
  }

  return {
    url: payload.secure_url || payload.url || '',
    publicId: payload.public_id || '',
  };
};

/**
 * Normalize an incoming image value so any uploaded image is stored on Cloudinary
 * and only the Cloudinary URL is saved to MongoDB.
 */
export const resolveCloudinaryImage = async (imageInput, folder = 'general') => {
  if (!imageInput || typeof imageInput !== 'string') return '';
  const trimmed = imageInput.trim();
  if (!trimmed) return '';
  if (isCloudinaryUrl(trimmed)) return trimmed;

  const isDataUri = trimmed.startsWith('data:image/');
  const isRemoteHttp = /^https?:\/\//i.test(trimmed);
  if (!isDataUri && !isRemoteHttp) {
    return '';
  }

  const uploaded = await uploadImageToCloudinary(trimmed, { folder });
  return uploaded.url;
};

export const extractCloudinaryPublicId = (imageUrl) => {
  if (!isCloudinaryUrl(imageUrl)) return '';
  try {
    const match = imageUrl.match(/\/image\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+(?:[?#].*)?$/i);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};

export const deleteImageFromCloudinary = async (urlOrPublicId) => {
  if (!urlOrPublicId || !isCloudinaryConfigured()) return false;
  const publicId = isCloudinaryUrl(urlOrPublicId)
    ? extractCloudinaryPublicId(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) return false;

  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ public_id: publicId, timestamp }, apiSecret);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(15000),
    });
    return res.ok;
  } catch {
    return false;
  }
};
