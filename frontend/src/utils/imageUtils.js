import API from '../services/api';

/**
 * Compress and center-crop an uploaded image File into a crisp square JPEG data URL
 * suitable for member ID card portraits prior to Cloudinary upload.
 */
export const compressPortraitImage = (file, size = 360, quality = 0.85) =>
  new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, or WebP).'));
    }
    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('Please choose an image smaller than 10 MB.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Center-crop square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Resize and compress a general image File (logo, gallery photo, announcement banner)
 * while preserving PNG transparency or JPEG quality before uploading to Cloudinary.
 */
export const compressImageForUpload = (file, maxDimension = 1600, quality = 0.86) =>
  new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, or WebP).'));
    }
    if (file.size > 15 * 1024 * 1024) {
      return reject(new Error('Please choose an image smaller than 15 MB.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image.'));
    reader.onload = () => {
      if (file.type === 'image/svg+xml') {
        return resolve(reader.result);
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (file.type === 'image/png') {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          return resolve(canvas.toDataURL('image/png'));
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        return resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Upload an image File or data URL to Cloudinary via backend and return { url, publicId }.
 */
export const uploadImageToCloud = async (
  fileOrDataUrl,
  folder = 'general',
  endpoint = '/admin/upload'
) => {
  const imageData =
    typeof fileOrDataUrl === 'string'
      ? fileOrDataUrl
      : await compressImageForUpload(fileOrDataUrl);

  const { data } = await API.post(endpoint, { image: imageData, folder });
  return data;
};
