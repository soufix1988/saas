import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { ToastProvider } from './components/ui/Toast';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import FormsPage from './components/forms/FormsPage';
import FormBuilder from './components/forms/FormBuilder';
import EntriesTable from './components/crm/EntriesTable';
import AppointmentModule from './components/appointments/AppointmentModule';
import AdminPage from './components/admin/AdminPage';
import PublicFormPage from './components/forms/PublicFormPage';
import LandingPage from './components/landing/LandingPage';

function AppLayout() {
  const { user, appConfig, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const lang = appConfig?.app_lang;
    if (lang) {
      const rtl = ['ar', 'he'].includes(lang);
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
    if (appConfig?.app_bg_color) {
      document.body.style.background = appConfig.app_bg_img
        ? `url(${appConfig.app_bg_img}) center/cover fixed, ${appConfig.app_bg_color}`
        : appConfig.app_bg_color;
    }
    if (appConfig?.app_color) {
      document.documentElement.style.setProperty('--primary-color', appConfig.app_color);
    }
  }, [appConfig]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <i className="fas fa-spinner fa-spin text-2xl" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileHeader onToggleSidebar={() => setSidebarOpen(o => !o)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id/edit" element={<FormBuilder />} />
          <Route path="/crm" element={<EntriesTable />} />
          <Route path="/appointments" element={<AppointmentModule />} />
          <Route path="/users" element={user.isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={user.isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function RootRouter() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <i className="fas fa-spinner fa-spin text-gray-400 text-2xl" />
    </div>
  );
  if (!user) return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/public" element={<PublicFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
  return (
    <Routes>
      <Route path="/public" element={<PublicFormPage />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <RootRouter />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
