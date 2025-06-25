# Kledje Backend API

واجهة برمجة التطبيقات الخلفية لمتجر Kledje - نظام إدارة متجر إلكتروني متكامل.

## المميزات

- 🔐 **نظام مصادقة آمن** - JWT tokens مع تشفير كلمات المرور
- 📦 **إدارة المنتجات** - CRUD operations كاملة للمنتجات
- 🛒 **إدارة الطلبات** - تتبع الطلبات وتحديث الحالات
- 🎯 **نظام العروض** - إدارة العروض والخصومات
- ⚙️ **إعدادات الموقع** - تخصيص إعدادات المتجر
- 📁 **رفع الملفات** - رفع ومعالجة الصور
- 📧 **إشعارات البريد الإلكتروني** - تأكيد الطلبات والتحديثات
- 🛡️ **الأمان** - Rate limiting, CORS, Helmet
- 📊 **قاعدة البيانات** - Supabase PostgreSQL
- ✅ **التحقق من البيانات** - Joi validation

## التقنيات المستخدمة

- **Node.js** - بيئة التشغيل
- **Express.js** - إطار العمل
- **Supabase** - قاعدة البيانات
- **JWT** - المصادقة
- **Multer & Sharp** - رفع ومعالجة الصور
- **Nodemailer** - إرسال الإيميلات
- **Joi** - التحقق من البيانات

## التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- حساب Supabase

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd backend
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
```

قم بتحديث ملف `.env` بالقيم الصحيحة:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

4. **تشغيل الخادم**
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## نقاط النهاية (Endpoints)

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي
- `PUT /api/auth/profile` - تحديث الملف الشخصي
- `PUT /api/auth/password` - تغيير كلمة المرور

### المنتجات
- `GET /api/products` - الحصول على جميع المنتجات
- `GET /api/products/:id` - الحصول على منتج واحد
- `POST /api/products` - إضافة منتج جديد (مدير فقط)
- `PUT /api/products/:id` - تحديث منتج (مدير فقط)
- `DELETE /api/products/:id` - حذف منتج (مدير فقط)
- `GET /api/products/meta/categories` - الحصول على الفئات

### الطلبات
- `GET /api/orders` - الحصول على جميع الطلبات (مدير فقط)
- `GET /api/orders/:id` - الحصول على طلب واحد
- `POST /api/orders` - إنشاء طلب جديد
- `PUT /api/orders/:id/status` - تحديث حالة الطلب (مدير فقط)
- `GET /api/orders/meta/stats` - إحصائيات الطلبات (مدير فقط)

### العروض
- `GET /api/offers` - الحصول على جميع العروض
- `GET /api/offers/:id` - الحصول على عرض واحد
- `POST /api/offers` - إضافة عرض جديد (مدير فقط)
- `PUT /api/offers/:id` - تحديث عرض (مدير فقط)
- `DELETE /api/offers/:id` - حذف عرض (مدير فقط)
- `GET /api/offers/meta/active` - العروض النشطة

### الإعدادات
- `GET /api/settings` - الحصول على إعدادات الموقع
- `PUT /api/settings` - تحديث إعدادات الموقع (مدير فقط)
- `GET /api/settings/contact` - معلومات التواصل
- `PUT /api/settings/contact` - تحديث معلومات التواصل (مدير فقط)

### رفع الملفات
- `POST /api/upload/image` - رفع صورة واحدة (مدير فقط)
- `POST /api/upload/images` - رفع عدة صور (مدير فقط)
- `DELETE /api/upload/:filename` - حذف صورة (مدير فقط)

## أمثلة الاستخدام

### تسجيل مستخدم جديد
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'فاطمة أحمد',
    email: 'fatma@example.com',
    password: 'password123',
    phone: '01012345678'
  })
});

const data = await response.json();
```

### الحصول على المنتجات
```javascript
const response = await fetch('/api/products?page=1&limit=10&category=العناية بالبشرة');
const data = await response.json();
```

### إنشاء طلب جديد
```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [
      {
        id: 'product-id',
        name: 'كريم مخمريا',
        price: 225,
        quantity: 2
      }
    ],
    customer_info: {
      firstName: 'فاطمة',
      lastName: 'أحمد',
      phone: '01012345678',
      email: 'fatma@example.com',
      city: 'القاهرة',
      address: 'شارع التحرير، وسط البلد'
    },
    payment_method: 'cod'
  })
});

const data = await response.json();
```

## الأمان

- **Rate Limiting**: حد أقصى 100 طلب كل 15 دقيقة
- **CORS**: مُكوّن للسماح بالطلبات من النطاقات المحددة
- **Helmet**: حماية من الثغرات الأمنية الشائعة
- **JWT**: رموز مصادقة آمنة
- **Password Hashing**: تشفير كلمات المرور باستخدام bcrypt

## معالجة الأخطاء

جميع الاستجابات تتبع نفس التنسيق:

```javascript
// نجح الطلب
{
  "success": true,
  "data": { ... },
  "message": "رسالة اختيارية"
}

// فشل الطلب
{
  "success": false,
  "error": "رسالة الخطأ"
}
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.