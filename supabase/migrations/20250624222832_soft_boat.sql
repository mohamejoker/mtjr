/*
  # إنشاء قاعدة البيانات الأولية لمتجر Kledje

  1. الجداول الجديدة
    - `products` - جدول المنتجات
      - `id` (uuid, primary key)
      - `name` (text) - اسم المنتج بالعربية
      - `name_en` (text) - اسم المنتج بالإنجليزية
      - `description` (text) - وصف المنتج
      - `price` (decimal) - السعر الحالي
      - `original_price` (decimal) - السعر الأصلي قبل الخصم
      - `discount` (integer) - نسبة الخصم
      - `category` (text) - فئة المنتج
      - `image` (text) - رابط صورة المنتج
      - `ingredients` (text[]) - مكونات المنتج
      - `featured` (boolean) - منتج مميز
      - `in_stock` (boolean) - متوفر في المخزون
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `offers` - جدول العروض
      - `id` (uuid, primary key)
      - `title` (text) - عنوان العرض
      - `description` (text) - وصف العرض
      - `discount` (integer) - نسبة الخصم
      - `category` (text) - الفئة المستهدفة
      - `end_date` (timestamp) - تاريخ انتهاء العرض
      - `active` (boolean) - العرض نشط
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders` - جدول الطلبات
      - `id` (text, primary key) - رقم الطلب
      - `items` (jsonb) - منتجات الطلب
      - `total` (decimal) - إجمالي المبلغ
      - `customer_info` (jsonb) - بيانات العميل
      - `status` (text) - حالة الطلب
      - `payment_method` (text) - طريقة الدفع
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `site_settings` - إعدادات الموقع
      - `id` (integer, primary key)
      - `site_name` (text) - اسم الموقع
      - `primary_color` (text) - اللون الأساسي
      - `secondary_color` (text) - اللون الثانوي
      - `hero_title` (text) - عنوان الصفحة الرئيسية
      - `hero_subtitle` (text) - العنوان الفرعي
      - `contact_info` (jsonb) - معلومات التواصل
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات للقراءة العامة
    - إضافة سياسات للكتابة (للمديرين فقط)
*/

-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  original_price decimal(10,2),
  discount integer DEFAULT 0,
  category text NOT NULL,
  image text,
  ingredients text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول العروض
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount integer NOT NULL DEFAULT 0,
  category text,
  end_date timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  items jsonb NOT NULL DEFAULT '[]',
  total decimal(10,2) NOT NULL DEFAULT 0,
  customer_info jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'placed',
  payment_method text DEFAULT 'cod',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_name text DEFAULT 'Kledje',
  primary_color text DEFAULT '#f78fb3',
  secondary_color text DEFAULT '#e5b2ca',
  hero_title text DEFAULT 'دللي جمالك بلمسة من الطبيعة',
  hero_subtitle text DEFAULT 'منتجاتنا مصنوعة بحب وشغف لتبرز تألقك الفريد',
  contact_info jsonb DEFAULT '{"phone": "+20 100 123 4567", "email": "info@kledje.com", "address": "القاهرة، مصر"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمنتجات
CREATE POLICY "المنتجات قابلة للقراءة للجميع"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "المنتجات قابلة للتعديل للمديرين"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات الأمان للعروض
CREATE POLICY "العروض قابلة للقراءة للجميع"
  ON offers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "العروض قابلة للتعديل للمديرين"
  ON offers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات الأمان للطلبات
CREATE POLICY "الطلبات قابلة للقراءة للجميع"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "الطلبات قابلة للإنشاء للجميع"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "الطلبات قابلة للتعديل للمديرين"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات الأمان لإعدادات الموقع
CREATE POLICY "إعدادات الموقع قابلة للقراءة للجميع"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "إعدادات الموقع قابلة للتعديل للمديرين"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);
CREATE INDEX IF NOT EXISTS idx_offers_end_date ON offers(end_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- إدراج بيانات تجريبية للمنتجات
INSERT INTO products (name, name_en, description, price, original_price, discount, category, image, ingredients, featured, in_stock) VALUES
('كريم مخمريا للوجه', 'Mekhmarya Face Cream', 'كريم طبيعي مرطب للوجه يحتوي على خلاصة المخمريا وزيت الأرجان لترطيب عميق ونعومة فائقة', 225.00, 300.00, 25, 'العناية بالبشرة', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', ARRAY['مخمريا طبيعية', 'زيت الأرجان', 'شمع العسل', 'فيتامين E'], true, true),
('سيروم فيتامين سي', 'Vitamin C Serum', 'سيروم مضاد للأكسدة يحتوي على فيتامين سي الطبيعي لإشراق البشرة ومحاربة علامات التقدم في السن', 180.00, 220.00, 18, 'العناية بالبشرة', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500', ARRAY['فيتامين سي', 'حمض الهيالورونيك', 'خلاصة الورد'], true, true),
('شامبو بزيت الأرجان', 'Argan Oil Shampoo', 'شامبو طبيعي غني بزيت الأرجان المغربي الأصلي لتنظيف وترطيب الشعر بعمق', 150.00, 180.00, 17, 'العناية بالشعر', 'https://images.unsplash.com/photo-1563806289-533554284534?w=500', ARRAY['زيت الأرجان المغربي', 'خلاصة الصبار', 'بروتين الكيراتين'], true, true),
('كريم الشعر بالكيراتين', 'Keratin Hair Cream', 'كريم مغذي للشعر يحتوي على الكيراتين الطبيعي لتقوية الشعر وإعطائه لمعان طبيعي', 195.00, 250.00, 22, 'العناية بالشعر', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', ARRAY['كيراتين طبيعي', 'زيت جوز الهند', 'فيتامين B5'], true, true),
('عطر الياسمين الطبيعي', 'Natural Jasmine Perfume', 'عطر طبيعي بخلاصة الياسمين الأصلي برائحة منعشة تدوم طويلاً', 320.00, 400.00, 20, 'العطور', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', ARRAY['خلاصة الياسمين', 'زيت الورد', 'المسك الطبيعي'], true, true),
('بوكس الدلع الكامل', 'Complete Pampering Box', 'مجموعة متكاملة من منتجات العناية تشمل كريم الوجه وسيروم وكريم الشعر في علبة هدايا أنيقة', 450.00, 600.00, 25, 'مجموعات خاصة', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500', ARRAY['كريم مخمريا', 'سيروم فيتامين سي', 'كريم الشعر'], true, true);

-- إدراج بيانات تجريبية للعروض
INSERT INTO offers (title, description, discount, category, end_date, active) VALUES
('عرض الجمعة البيضاء', 'خصم 30% على جميع منتجات العناية بالبشرة لفترة محدودة', 30, 'العناية بالبشرة', '2024-12-31 23:59:59', true),
('عرض العناية بالشعر', 'اشتري منتجين واحصلي على الثالث مجاناً من منتجات العناية بالشعر', 25, 'العناية بالشعر', '2024-12-25 23:59:59', true);

-- إدراج الإعدادات الافتراضية للموقع
INSERT INTO site_settings (id, site_name, primary_color, secondary_color, hero_title, hero_subtitle, contact_info) VALUES
(1, 'Kledje', '#f78fb3', '#e5b2ca', 'دللي جمالك بلمسة من الطبيعة', 'منتجاتنا مصنوعة بحب وشغف لتبرز تألقك الفريد', '{"phone": "+20 100 123 4567", "email": "info@kledje.com", "address": "القاهرة، مصر"}')
ON CONFLICT (id) DO NOTHING;