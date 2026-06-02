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

const ACCENT_COLORS = ['#7c3aed', '#ec4899', '#3b82f6', '#06b6d4', '#f59e0b', '#8b5cf6'];

export default function Sidebar({ open, onClose }) {
  const { user, appConfig, logout } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const canSee = (item) => {
    if (item.adminOnly) return user?.isAdmin;
    if (item.requireDashboard) {
      if (user?.isAdmin) return true;
      return Object.values(user?.rights || {}).some(r => r.viewDashboard);
    }
    return true;
  };

  const visibleItems = NAV_ITEMS.filter(canSee);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`sidebar flex flex-col ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
            {appConfig?.app_logo ? (
              <img src={appConfig.app_logo} alt="logo" className="w-9 h-9 rounded-md object-cover" />
            ) : (
              <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-base text-white`} />
            )}
          </div>
          <span className="font-bold text-gray-900 text-lg truncate">
            {appConfig?.app_name || 'FormSaaS'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {visibleItems.map((item, idx) => {
            const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative
                  ${isActive ? 'text-white' : 'text-gray-700 hover:text-gray-900'}`
                }
                style={({ isActive }) => ({
                  background: isActive ? `${accentColor}15` : 'transparent',
                  borderLeft: isActive ? `4px solid ${accentColor}` : 'none',
                  paddingLeft: isActive ? '12px' : '16px',
                })}
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 text-sm flex-shrink-0
                      ${isActive ? 'scale-110' : ''}`}
                      style={{ color: isActive ? accentColor : '#9ca3af' }}>
                      <i className={`fas ${item.icon}`} />
                    </div>
                    <span className="flex-1">{t[item.key]}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4" style={{ borderTop: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
              {(user?.fullName || user?.identifier || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || user?.identifier}
              </p>
              {user?.isAdmin && (
                <p className="text-xs text-purple-600 font-medium">⭐ Admin</p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <i className="fas fa-sign-out-alt text-sm" />
            {t.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
