import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('يُسمح فقط بملفات الصور'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private/Admin
router.post('/image', protect, authorize('admin'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'لم يتم اختيار ملف'
      });
    }

    // Generate unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process and save image
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Generate URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    res.status(200).json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      data: {
        filename,
        url: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, authorize('admin'), upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'لم يتم اختيار ملفات'
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      // Generate unique filename
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const filepath = path.join(uploadsDir, filename);

      // Process and save image
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(filepath);

      // Generate URL
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

      uploadedImages.push({
        filename,
        url: imageUrl,
        size: file.size
      });
    }

    res.status(200).json({
      success: true,
      message: `تم رفع ${uploadedImages.length} صورة بنجاح`,
      data: uploadedImages
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
router.delete('/:filename', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        error: 'الملف غير موجود'
      });
    }

    // Delete file
    fs.unlinkSync(filepath);

    res.status(200).json({
      success: true,
      message: 'تم حذف الصورة بنجاح'
    });
  } catch (error) {
    next(error);
  }
});

export default router;