import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/contexts/AdminContext';

const SettingsTab = () => {
  const { siteSettings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>إعدادات الموقع</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="siteName">اسم الموقع</Label><Input id="siteName" value={siteSettings.siteName} onChange={(e) => updateSiteSettings({siteName: e.target.value})} /></div>
          <div><Label htmlFor="heroTitle">عنوان الصفحة الرئيسية</Label><Input id="heroTitle" value={siteSettings.heroTitle} onChange={(e) => updateSiteSettings({heroTitle: e.target.value})} /></div>
          <div><Label htmlFor="heroSubtitle">العنوان الفرعي</Label><Textarea id="heroSubtitle" value={siteSettings.heroSubtitle} onChange={(e) => updateSiteSettings({heroSubtitle: e.target.value})} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label htmlFor="primaryColor">اللون الأساسي</Label><Input id="primaryColor" type="color" value={siteSettings.primaryColor} onChange={(e) => updateSiteSettings({primaryColor: e.target.value})} /></div>
            <div><Label htmlFor="secondaryColor">اللون الثانوي</Label><Input id="secondaryColor" type="color" value={siteSettings.secondaryColor} onChange={(e) => updateSiteSettings({secondaryColor: e.target.value})} /></div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">معلومات التواصل</h3>
            <div><Label htmlFor="phone">رقم الهاتف</Label><Input id="phone" value={siteSettings.contactInfo.phone} onChange={(e) => updateSiteSettings({contactInfo: {...siteSettings.contactInfo, phone: e.target.value}})} /></div>
            <div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" type="email" value={siteSettings.contactInfo.email} onChange={(e) => updateSiteSettings({contactInfo: {...siteSettings.contactInfo, email: e.target.value}})} /></div>
            <div><Label htmlFor="address">العنوان</Label><Textarea id="address" value={siteSettings.contactInfo.address} onChange={(e) => updateSiteSettings({contactInfo: {...siteSettings.contactInfo, address: e.target.value}})} /></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;