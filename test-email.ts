import nodemailer from 'nodemailer';

async function testGmail() {
  console.log("DEBUG: All env vars:", Object.keys(process.env));
  
  // استخدام المتغيرات المحدثة في .env.example
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.error("❌ يرجى ضبط GMAIL_USER و GMAIL_PASS في إعدادات المشروع");
    return;
  }

  console.log("🚀 محاولة الاتصال بـ Gmail...");

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });

  try {
    await transporter.sendMail({
      from: user,
      to: user,
      subject: "اختبار إرسال من Gmail",
      text: "هذه رسالة اختبار من بيئة AI Studio للتأكد من عمل الاتصال."
    });
    console.log("✅ تم إرسال البريد بنجاح!");
  } catch (error) {
    console.error("❌ فشل الإرسال:", error);
  }
}

testGmail();
