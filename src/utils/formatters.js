/**
 * تنسيق الأسعار بالجنيه المصري
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '0 ج.م';
  return `${price.toFixed(2)} ج.م`;
};

/**
 * تنسيق التواريخ بالعربية
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    locale: 'ar-EG'
  };
  
  return new Date(date).toLocaleDateString('ar-EG', options);
};

/**
 * تنسيق أرقام الهاتف المصرية
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // إزالة جميع الرموز غير الرقمية
  const cleaned = phone.replace(/\D/g, '');
  
  // تنسيق الرقم المصري
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * تقصير النص مع إضافة نقاط
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * تحويل الرقم إلى نص عربي
 */
export const numberToArabic = (num) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
};

/**
 * حساب نسبة الخصم
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * التحقق من صحة البريد الإلكتروني
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * التحقق من صحة رقم الهاتف المصري
 */
export const isValidEgyptianPhone = (phone) => {
  const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};