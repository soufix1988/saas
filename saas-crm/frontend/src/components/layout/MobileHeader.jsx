import { useAuth } from '../../hooks/useAuth.jsx';

export default function MobileHeader({ onToggleSidebar }) {
  const { appConfig } = useAuth();
  const color = appConfig?.app_color || '#111827';
  const textColor = appConfig?.app_text_color || '#ffffff';

  return (
    <header
      className="mobile-header fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 shadow-md md:hidden"
      style={{ background: color }}
    >
      <button onClick={onToggleSidebar} className="text-xl" style={{ color: textColor }}>
        <i className="fas fa-bars" />
      </button>
      <span className="font-bold text-base" style={{ color: textColor }}>
        {appConfig?.app_name || 'FormSaaS'}
      </span>
      <div className="w-8" />
    </header>
  );
}
