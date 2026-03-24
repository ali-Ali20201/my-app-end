import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // التحقق مما إذا كان التطبيق مثبتاً بالفعل
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

  useEffect(() => {
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
        alert("الآن يمكنك الضغط على خيارات المتصفح (الثلاث نقاط) واختيار 'إضافة إلى الشاشة الرئيسية' ليظهر التطبيق بأيقونته الحمراء!");
      }
    }
  };

  const checkPassword = () => {
    if (password === 'fadiali1985$') {
      setIsLogged(true);
    } else {
      alert('كلمة المرور خاطئة!');
    }
  };

  const isInstalling = new URLSearchParams(window.location.search).get('install') === 'true';

  // إذا كان التطبيق مثبتاً بالفعل، نوجهه فوراً لصفحة المستخدمين
  if (isStandalone) {
    return <Navigate to="/home" replace />;
  }

  if (!isLogged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 p-6 text-center">
        <h2 className="text-white text-2xl mb-6">دخول الإدارة</h2>
        <input 
          type="password" 
          className="p-3 rounded-lg w-full max-w-xs mb-4 text-center text-black"
          placeholder="أدخل كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={checkPassword} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">
          دخول
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#b91c1c] to-[#7f1d1d] z-[100] flex flex-col items-center justify-center p-8">
      {isInstalling && (
        <div className="bg-white/20 backdrop-blur-md text-white p-4 rounded-xl mb-6 text-sm border border-white/30 animate-pulse text-center">
          جاري تجهيز تثبيت نسخة الإدارة... يرجى الضغط على الزر أدناه إذا لم تظهر نافذة التثبيت تلقائياً.
        </div>
      )}
      <img 
        src="/app-icon-admin.png?v=8" 
        alt="Admin App" 
        referrerPolicy="no-referrer"
        className="w-40 mb-8 drop-shadow-2xl" 
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.error("Admin Icon failed to load:", target.src);
          target.src = 'https://picsum.photos/seed/admin/200/200';
        }}
      />
      <h1 className="text-white text-3xl font-bold mb-4">نسخة المدير الخاصة</h1>
      <button 
        onClick={handleInstall}
        className="bg-white text-[#b91c1c] px-10 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all mb-4 w-full max-w-xs"
      >
        تثبيت تطبيق الإدارة
      </button>

      <button 
        onClick={() => navigate('/home')}
        className="bg-transparent text-white border border-white/30 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all w-full max-w-xs"
      >
        الدخول للموقع
      </button>
    </div>
  );
}
