import Joi from 'joi';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  id: Joi.object({
    id: Joi.string().uuid().required()
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'price', 'created_at', '-name', '-price', '-created_at').default('-created_at')
  }),

  product: Joi.object({
    name: Joi.string().required().min(2).max(255),
    name_en: Joi.string().max(255),
    description: Joi.string().max(1000),
    price: Joi.number().positive().required(),
    original_price: Joi.number().positive(),
    discount: Joi.number().integer().min(0).max(100).default(0),
    category: Joi.string().required(),
    image: Joi.string().uri(),
    ingredients: Joi.array().items(Joi.string()),
    featured: Joi.boolean().default(false),
    in_stock: Joi.boolean().default(true)
  }),

  order: Joi.object({
    items: Joi.array().items(Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().positive().required()
    })).min(1).required(),
    customer_info: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().pattern(/^(010|011|012|015)[0-9]{8}$/).required(),
      email: Joi.string().email(),
      city: Joi.string().required(),
      address: Joi.string().required(),
      notes: Joi.string()
    }).required(),
    payment_method: Joi.string().valid('cod', 'card', 'wallet').default('cod')
  }),

  offer: Joi.object({
    title: Joi.string().required().min(2).max(255),
    description: Joi.string().max(1000),
    discount: Joi.number().integer().min(1).max(100).required(),
    category: Joi.string(),
    end_date: Joi.date().iso().greater('now'),
    active: Joi.boolean().default(true)
  })
};