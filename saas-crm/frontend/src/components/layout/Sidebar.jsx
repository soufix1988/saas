import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'fa-chart-line', key: 'dashboard', adminOnly: false, requireDashboard: true },
  { path: '/forms', icon: 'fa-list-alt', key: 'forms', adminOnly: false },
  { path: '/appointments', icon: 'fa-calendar-check', key: 'appointments', adminOnly: false },
  { path: '/crm', icon: 'fa-database', key: 'crm', adminOnly: false },
  { path: '/users', icon: 'fa-users', key: 'users', adminOnly: true },
  { path: '/settings', icon: 'fa-cog', key: 'settings', adminOnly: true },
];

export default function Sidebar({ open, onClose }) {
  const { user, appConfig, logout } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const color = appConfig?.app_color || '#111827';
  const textColor = appConfig?.app_text_color || '#ffffff';

  const canSee = (item) => {
    if (item.adminOnly) return user?.isAdmin;
    if (item.requireDashboard) {
      if (user?.isAdmin) return true;
      return Object.values(user?.rights || {}).some(r => r.viewDashboard);
    }
    return true;
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside
        className={`sidebar shadow-2xl flex flex-col transition-all duration-300 ${open ? 'open' : ''}`}
        style={{ background: color, color: textColor }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6"
            style={{ background: textColor + '20' }}>
            {appConfig?.app_logo ? (
              <img src={appConfig.app_logo} alt="logo" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-lg`} style={{ color: textColor }} />
            )}
          </div>
          <span className="font-bold text-lg truncate" style={{ color: textColor }}>
            {appConfig?.app_name || 'FormSaaS'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_ITEMS.filter(canSee).map((item, idx) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                ${isActive ? 'bg-white/20 backdrop-blur-sm shadow-lg' : 'hover:bg-white/10'}`
              }
              style={{ color: textColor }}
            >
              <i className={`fas ${item.icon} w-4 transition-transform duration-300 group-hover:scale-125`} />
              <span className="flex-1">{t[item.key]}</span>
              {idx <= 3 && <span className="text-xs opacity-60">•</span>}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl transition-all duration-300" style={{ background: textColor + '10' }}>
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform duration-300 hover:scale-110">
              {(user?.fullName || user?.identifier || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: textColor }}>
                {user?.fullName || user?.identifier}
              </p>
              {user?.isAdmin && (
                <p className="text-xs font-medium" style={{ color: textColor + 'CC' }}>⭐ Admin</p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
            style={{ color: textColor }}
          >
            <i className="fas fa-sign-out-alt text-lg" />
            {t.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
