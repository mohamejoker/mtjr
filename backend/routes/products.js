import express from 'express';
import { supabase } from '../config/database.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery, schemas } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', validateQuery(schemas.pagination), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-created_at', category, search, featured, in_stock } = req.query;
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }
    
    if (in_stock !== undefined) {
      query = query.eq('in_stock', in_stock === 'true');
    }

    // Apply sorting
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', validateParams(schemas.id), async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateBody(schemas.product), async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateParams(schemas.id), validateBody(schemas.product), async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), validateParams(schemas.id), async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('products')
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

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
router.get('/meta/categories', async (req, res, next) => {
  try {
    const { data: categories, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;

    const uniqueCategories = [...new Set(categories.map(item => item.category))];

    res.status(200).json({
      success: true,
      data: uniqueCategories
    });
  } catch (error) {
    next(error);
  }
});

export default router;