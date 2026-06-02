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

const NAV_COLORS = [
  { active: 'rgba(123,97,255,0.25)', icon: '#a78bfa' },
  { active: 'rgba(240,147,251,0.2)', icon: '#f0abfc' },
  { active: 'rgba(79,172,254,0.2)', icon: '#7dd3fc' },
  { active: 'rgba(0,212,170,0.2)', icon: '#5eead4' },
  { active: 'rgba(251,146,60,0.2)', icon: '#fdba74' },
  { active: 'rgba(167,139,250,0.2)', icon: '#c084fc' },
];

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
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={onClose} />
      )}
      <aside
        className={`sidebar flex flex-col ${open ? 'open' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #1a1535 0%, #0f0c29 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)'
        }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-6"
            style={{
              background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
              boxShadow: '0 4px 16px rgba(123,97,255,0.4)'
            }}>
            {appConfig?.app_logo ? (
              <img src={appConfig.app_logo} alt="logo" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-base text-white`} />
            )}
          </div>
          <span className="font-bold text-lg text-white truncate">
            {appConfig?.app_name || 'FormSaaS'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {visibleItems.map((item, idx) => {
            const colors = NAV_COLORS[idx] || NAV_COLORS[0];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative
                  ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`
                }
                style={({ isActive }) => ({
                  background: isActive ? colors.active : 'transparent',
                  border: isActive ? `1px solid ${colors.icon}30` : '1px solid transparent',
                })}
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isActive ? '' : 'group-hover:bg-white/10'}`}
                      style={isActive ? { background: colors.active } : {}}>
                      <i className={`fas ${item.icon} text-sm transition-colors duration-300`}
                        style={{ color: isActive ? colors.icon : 'inherit' }} />
                    </div>
                    <span className="flex-1">{t[item.key]}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: colors.icon, boxShadow: `0 0 8px ${colors.icon}` }} />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl transition-all duration-300 hover:bg-white/5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 text-white"
              style={{
                background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
                boxShadow: '0 4px 12px rgba(123,97,255,0.4)'
              }}>
              {(user?.fullName || user?.identifier || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.fullName || user?.identifier}
              </p>
              {user?.isAdmin && (
                <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>⭐ Admin</p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-red-500/15 hover:-translate-y-0.5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >
            <i className="fas fa-sign-out-alt" />
            {t.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
