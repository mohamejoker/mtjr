import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Kledje Store" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `تأكيد الطلب #${order.id}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f78fb3;">شكراً لك على طلبك!</h2>
        <p>عزيزتي ${order.customer_info.firstName},</p>
        <p>تم استلام طلبك بنجاح ونحن نعمل على تجهيزه.</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>تفاصيل الطلب:</h3>
          <p><strong>رقم الطلب:</strong> ${order.id}</p>
          <p><strong>المجموع:</strong> ${order.total} ج.م</p>
          <p><strong>طريقة الدفع:</strong> ${order.payment_method === 'cod' ? 'الدفع عند الاستلام' : order.payment_method}</p>
        </div>
        
        <p>سيتم التواصل معك قريباً لتأكيد الطلب وتحديد موعد التوصيل.</p>
        <p>شكراً لثقتك في Kledje!</p>
      </div>
    `
  }),

  statusUpdate: (order, status) => ({
    subject: `تحديث حالة الطلب #${order.id}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f78fb3;">تحديث حالة طلبك</h2>
        <p>عزيزتي ${order.customer_info.firstName},</p>
        <p>تم تحديث حالة طلبك #${order.id}</p>
        
        <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>الحالة الحالية: ${getStatusLabel(status)}</h3>
        </div>
        
        <p>يمكنك تتبع طلبك في أي وقت من خلال موقعنا.</p>
        <p>شكراً لثقتك في Kledje!</p>
      </div>
    `
  })
};

const getStatusLabel = (status) => {
  const labels = {
    placed: 'تم استلام الطلب',
    processing: 'قيد التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي'
  };
  return labels[status] || status;
};