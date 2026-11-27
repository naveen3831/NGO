import { uploadImageToCloudinary } from '../utils/cloudinaryService.js';

// @desc    Upload image to Cloudinary and return secure URL + public ID
// @route   POST /api/v1/admin/upload  |  POST /api/v1/auth/upload-image
// @access  Private
export const uploadImage = async (req, res, next) => {
  try {
    const { image, folder = 'general' } = req.body;

    if (!image || typeof image !== 'string' || !image.trim()) {
      return res.status(400).json({ message: 'Please provide an image file or URL to upload.' });
    }

    const safeFolder = String(folder)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '') || 'general';

    const result = await uploadImageToCloudinary(image.trim(), { folder: safeFolder });

    res.status(201).json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    next(error);
  }
};
