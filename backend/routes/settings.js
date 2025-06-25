import express from 'express';
import { supabase } from '../config/database.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const allowedFields = [
      'site_name',
      'primary_color',
      'secondary_color',
      'hero_title',
      'hero_subtitle',
      'contact_info'
    ];

    // Filter only allowed fields
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    updateData.updated_at = new Date().toISOString();

    const { data: settings, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get contact info
// @route   GET /api/settings/contact
// @access  Public
router.get('/contact', async (req, res, next) => {
  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('contact_info')
      .eq('id', 1)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: settings.contact_info
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update contact info
// @route   PUT /api/settings/contact
// @access  Private/Admin
router.put('/contact', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { phone, email, address } = req.body;

    const contactInfo = {
      ...(phone && { phone }),
      ...(email && { email }),
      ...(address && { address })
    };

    const { data: settings, error } = await supabase
      .from('site_settings')
      .update({ 
        contact_info: contactInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select('contact_info')
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'تم تحديث معلومات التواصل',
      data: settings.contact_info
    });
  } catch (error) {
    next(error);
  }
});

export default router;