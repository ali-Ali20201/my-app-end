/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { NotificationProvider } from "./context/NotificationContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileAppHandler from "./components/MobileAppHandler";
import InstallPWA from "./components/InstallPWA";
import AdminPage from "./components/AdminPage"; 
import Home from "./pages/Home";
import Recharge from "./pages/Recharge";
import Orders from "./pages/Orders";
import Instructions from "./pages/Instructions";
import PromoCodes from "./pages/PromoCodes";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Recharges from "./pages/admin/Recharges";
import AdminOrders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";
import AdminPromoCodes from "./pages/admin/PromoCodes";
import ContactUs from "./pages/ContactUs";
import Mail from "./pages/Mail";
import Messages from "./pages/admin/Messages";
import Balance from "./pages/admin/Balance";
import Users from "./pages/admin/Users";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  // 1. قراءة الرابط الحالي (Path)
  const currentPath = window.location.pathname;

  // 2. التحقق مما إذا كان الرابط هو الرابط السري للأدمن
  const isAdminPath = currentPath.startsWith('/adminali20112024');

  return (
    <AuthProvider>
      <NotificationProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <MobileAppHandler />
            
            {/* ========================================== */}
            {/* 🛡️ مسارات تطبيق الإدارة (إذا كان الرابط هو الرابط السري) */}
            {/* ========================================== */}
            {isAdminPath ? (
              <Routes>
                {/* الصفحة الرئيسية للأدمن هي صفحة تسجيل الدخول/التثبيت */}
                <Route path="/adminali20112024" element={<AdminPage />} />
                <Route path="/adminali20112024/login" element={<AdminLogin />} />

                {/* مسارات الإدارة المحمية */}
                <Route path="/adminali20112024" element={<Layout />}>
                  <Route path="dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
                  <Route path="products" element={<ProtectedRoute adminOnly><Products /></ProtectedRoute>} />
                  <Route path="categories" element={<ProtectedRoute adminOnly><Categories /></ProtectedRoute>} />
                  <Route path="recharges" element={<ProtectedRoute adminOnly><Recharges /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
                  <Route path="promo-codes" element={<ProtectedRoute adminOnly><AdminPromoCodes /></ProtectedRoute>} />
                  <Route path="settings" element={<ProtectedRoute adminOnly><Settings /></ProtectedRoute>} />
                  <Route path="messages" element={<ProtectedRoute adminOnly><Messages /></ProtectedRoute>} />
                  <Route path="balance" element={<ProtectedRoute adminOnly><Balance /></ProtectedRoute>} />
                  <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
                </Route>

                {/* أي رابط خاطئ في الأدمن يعود للرئيسية للأدمن */}
                <Route path="*" element={<Navigate to="/adminali20112024" replace />} />
              </Routes>
            ) : (
            
            /* ========================================== */
            /* 👤 مسارات تطبيق المستخدمين (الرابط العادي) */
            /* ========================================== */
              <Routes>
                {/* الصفحة الرئيسية للمستخدمين هي صفحة التثبيت الزرقاء */}
                <Route path="/" element={<InstallPWA />} />

                {/* مسارات المستخدم العامة */}
                <Route element={<Layout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/recharge" element={<Recharge />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/instructions" element={<Instructions />} />
                  <Route path="/promo-codes" element={<PromoCodes />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/mail" element={<Mail />} />
                </Route>

                {/* أي رابط خاطئ في تطبيق المستخدم يعود للرئيسية */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}

          </BrowserRouter>
        </CurrencyProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
