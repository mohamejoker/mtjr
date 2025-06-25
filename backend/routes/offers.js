import express from 'express';
import { supabase } from '../config/database.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery, schemas } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
router.get('/', validateQuery(schemas.pagination), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-created_at', active, category } = req.query;
    
    let query = supabase
      .from('offers')
      .select('*', { count: 'exact' });

    // Apply filters
    if (active !== undefined) {
      query = query.eq('active', active === 'true');
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    // Filter out expired offers for public access
    if (!req.user || req.user.role !== 'admin') {
      query = query.or('end_date.is.null,end_date.gt.' + new Date().toISOString());
    }

    // Apply sorting
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: offers, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: offers.length,
      total: count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      data: offers
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
router.get('/:id', validateParams(schemas.id), async (req, res, next) => {
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !offer) {
      return res.status(404).json({
        success: false,
        error: 'العرض غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateBody(schemas.offer), async (req, res, next) => {
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateParams(schemas.id), validateBody(schemas.offer), async (req, res, next) => {
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !offer) {
      return res.status(404).json({
        success: false,
        error: 'العرض غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), validateParams(schemas.id), async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get active offers
// @route   GET /api/offers/active
// @access  Public
router.get('/meta/active', async (req, res, next) => {
  try {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('active', true)
      .or('end_date.is.null,end_date.gt.' + new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
});

export default router;