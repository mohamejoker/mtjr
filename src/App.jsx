import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingPage } from '@/components/ui/loading';
import NotFound from '@/components/NotFound';
import HomePage from '@/pages/HomePage';
import AdminPage from '@/pages/AdminPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';
import ProductsPage from '@/pages/ProductsPage';
import OffersPage from '@/pages/OffersPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

const AppContent = () => {
  const { loading, siteSettings } = useAdmin();

  if (loading) {
    return <LoadingPage message="جاري تحميل المتجر..." />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{siteSettings.site_name || 'Kledje'} - متجر منتجات العناية الفاخرة</title>
        <meta name="description" content={`اكتشف مجموعة ${siteSettings.site_name || 'Kledje'} الفريدة من منتجات العناية الطبيعية عالية الجودة. كريمات ومنتجات طبيعية للعناية بالبشرة والشعر في مصر.`} />
        <meta name="keywords" content="kledje, كليدج, منتجات العناية, كريمات طبيعية, العناية بالبشرة, العناية بالشعر, مصر, جنيه مصري" />
        <meta property="og:title" content={`${siteSettings.site_name || 'Kledje'} - متجر منتجات العناية الفاخرة`} />
        <meta property="og:description" content={`اكتشف مجموعة ${siteSettings.site_name || 'Kledje'} الفريدة من منتجات العناية الطبيعية عالية الجودة`} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={siteSettings.primary_color || '#f78fb3'} />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AdminProvider>
          <Router>
            <AppContent />
          </Router>
        </AdminProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;