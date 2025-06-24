// فئات المنتجات
export const PRODUCT_CATEGORIES = [
  'العناية بالبشرة',
  'العناية بالشعر',
  'العناية الشخصية',
  'العطور',
  'مجموعات خاصة'
];

// حالات الطلبات
export const ORDER_STATUSES = {
  PLACED: 'placed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// تسميات حالات الطلبات بالعربية
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PLACED]: 'تم استلام الطلب',
  [ORDER_STATUSES.PROCESSING]: 'قيد التجهيز',
  [ORDER_STATUSES.SHIPPED]: 'تم الشحن',
  [ORDER_STATUSES.DELIVERED]: 'تم التوصيل',
  [ORDER_STATUSES.CANCELLED]: 'ملغي'
};

// المحافظات المصرية
export const EGYPTIAN_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الأسكندرية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'القليوبية',
  'البحيرة',
  'الغربية',
  'بور سعيد',
  'دمياط',
  'الإسماعيلية',
  'السويس',
  'كفر الشيخ',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء'
];

// طرق الدفع
export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  WALLET: 'wallet'
};

// تسميات طرق الدفع
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'الدفع عند الاستلام',
  [PAYMENT_METHODS.CARD]: 'بطاقة ائتمان',
  [PAYMENT_METHODS.WALLET]: 'محفظة إلكترونية'
};

// إعدادات التطبيق
export const APP_CONFIG = {
  SITE_NAME: 'Kledje',
  CURRENCY: 'ج.م',
  PHONE_REGEX: /^(010|011|012|015)[0-9]{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MAX_CART_ITEMS: 99,
  FREE_SHIPPING_THRESHOLD: 500,
  DEFAULT_PRODUCT_IMAGE: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
};

// رسائل التوست
export const TOAST_MESSAGES = {
  PRODUCT_ADDED: 'تمت الإضافة إلى السلة بنجاح',
  PRODUCT_REMOVED: 'تم حذف المنتج من السلة',
  ORDER_PLACED: 'تم إرسال طلبك بنجاح',
  FORM_ERROR: 'يرجى ملء جميع الحقول المطلوبة',
  NETWORK_ERROR: 'خطأ في الاتصال، يرجى المحاولة مرة أخرى',
  FEATURE_NOT_IMPLEMENTED: 'هذه الميزة قيد التطوير'
};

// روابط التواصل الاجتماعي
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/kledje',
  INSTAGRAM: 'https://instagram.com/kledje',
  TWITTER: 'https://twitter.com/kledje',
  WHATSAPP: 'https://wa.me/201001234567'
};