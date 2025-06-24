import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <Card className="glass-effect border-0">
            <CardContent className="p-8 space-y-6">
              {/* رقم 404 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="text-8xl font-bold gradient-text"
              >
                404
              </motion.div>
              
              {/* العنوان */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold"
              >
                الصفحة غير موجودة
              </motion.h1>
              
              {/* الوصف */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground"
              >
                عذراً، الصفحة التي تبحثين عنها غير موجودة أو تم نقلها إلى مكان آخر.
              </motion.p>
              
              {/* الأزرار */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <Link to="/" className="block">
                  <Button className="w-full gradient-bg text-white font-bold">
                    <Home className="w-4 h-4 ml-2" />
                    العودة للرئيسية
                  </Button>
                </Link>
                
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 ml-2" />
                    تصفح المنتجات
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للصفحة السابقة
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;