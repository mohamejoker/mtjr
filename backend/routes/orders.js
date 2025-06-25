import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/database.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateBody, validateParams, validateQuery, schemas } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, authorize('admin'), validateQuery(schemas.pagination), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-created_at', status } = req.query;
    
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    // Apply sorting
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      },
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', validateBody(schemas.order), async (req, res, next) => {
  try {
    // Generate order ID
    const orderId = `KLD-${Date.now()}`;
    
    // Calculate total
    const total = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
      id: orderId,
      items: req.body.items,
      total: total,
      customer_info: req.body.customer_info,
      payment_method: req.body.payment_method || 'cod',
      status: 'placed'
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    // TODO: Send confirmation email
    // TODO: Send SMS notification
    // TODO: Update inventory

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['placed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'حالة الطلب غير صحيحة'
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    // TODO: Send status update notification

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة الطلب',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
router.get('/meta/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Get total orders count
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get orders by status
    const { data: statusStats } = await supabase
      .from('orders')
      .select('status')
      .not('status', 'is', null);

    // Calculate total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'delivered');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

    // Group orders by status
    const ordersByStatus = statusStats?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        ordersByStatus
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;