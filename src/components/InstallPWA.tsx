import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function InstallPWA() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  
  // 1. التحقق مما إذا كان التطبيق مثبتاً بالفعل
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  // 2. نجعل الصفحة تظهر دائماً بشكل افتراضي لكي لا تظهر شاشة بيضاء
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Fetch settings for logo
    apiFetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);

    // التحقق مما إذا كان الحدث قد تم التقاطه بالفعل في index.html
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('install') === 'true' && deferredPrompt) {
      // محاولة التثبيت التلقائي عند توفر الحدث (قد تتطلب نقرة من المستخدم في بعض المتصفحات)
      handleInstall();
    }
  }, [deferredPrompt]);

  const handleInstall = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        console.log(`User response: ${outcome}`);
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          (window as any).deferredPrompt = null;
          navigate('/home');
        }
      } catch (err) {
        console.error("Installation prompt error:", err);
      }
    } else {
      // التحقق مما إذا كان التطبيق يعمل داخل iframe (معاينة AI Studio)
      const isInIframe = window.self !== window.top;
      
      if (isInIframe) {
        // فتح التطبيق في علامة تبويب جديدة خارج الـ iframe لتمكين التثبيت
        const url = new URL(window.location.href);
        url.searchParams.set('install', 'true');
        window.open(url.toString(), '_blank');
      } else {
        // إذا كان خارج الـ iframe وما زال لا يعمل، نظهر الرسالة الإرشادية
        alert('لتثبيت التطبيق:\n\n📱 في الآيفون: اضغط زر المشاركة (السهم للأعلى) في أسفل الشاشة ثم اختر "إضافة للشاشة الرئيسية".\n\n🤖 في الأندرويد: من قائمة المتصفح (النقاط الثلاث) اختر "تثبيت التطبيق" أو "Add to Home screen".');
      }
    }
  };

  // 3. إذا كان التطبيق مثبتاً، نوجهه فوراً لصفحة البداية
  if (isStandalone) {
    return <Navigate to="/home" replace />;
  }

  const isInstalling = new URLSearchParams(window.location.search).get('install') === 'true';

  if (!showBanner) return <Navigate to="/home" replace />;

  return (
    /* الخلفية الزرقاء التي تغطي كامل الشاشة كما في الصورة */
    <div className="fixed inset-0 bg-[#4f46e5] z-[100] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500" dir="rtl">
      
      <div className="flex flex-col items-center w-full max-w-sm text-center">
        
        {isInstalling && (
          <div className="bg-white/20 backdrop-blur-md text-white p-4 rounded-xl mb-6 text-sm border border-white/30 animate-pulse">
            جاري تجهيز التثبيت... يرجى الضغط على الزر أدناه إذا لم تظهر نافذة التثبيت تلقائياً.
          </div>
        )}

        {/* المربع الذي يحتوي على أيقونة التطبيق (icon.png) */}
        <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-[40px] shadow-2xl flex items-center justify-center mb-10 border border-white/20 overflow-hidden">
          <img 
            src={settings.main_logo || "/app-icon.png?v=1"} 
            alt="Ali Cash Icon" 
            className="w-32 h-32 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/seed/ali-cash/256/256';
            }}
          />
        </div>

        {/* النصوص المطابقة للصورة تماماً */}
        <h1 className="text-white text-4xl font-bold mb-4 tracking-tight">
          مرحباً بك في علي كاش
        </h1>
        
        <p className="text-indigo-100 text-lg mb-12 leading-relaxed">
          ثبت التطبيق الآن للوصول السريع والتنبيهات الفورية
        </p>

        {/* زر التثبيت */}
        <button
          onClick={handleInstall}
          className="w-full bg-white text-[#4f46e5] py-4 rounded-2xl text-xl font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95 mb-4"
        >
          تثبيت التطبيق
        </button>

        {/* زر الدخول للموقع (مهم جداً لكي لا يعلق المستخدم) */}
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-transparent text-white border border-white/30 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all active:scale-95"
        >
          الدخول للموقع
        </button>

      </div>
    </div>
  );
}
