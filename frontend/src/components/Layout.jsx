import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/ai-insights', label: 'AI Insights' }
];

function navLinkClasses({ isActive }) {
  return [
    'px-space-md py-space-xs rounded-full font-label-lg text-label-lg transition-all',
    isActive
      ? 'bg-surface-container-high text-primary font-bold shadow-[0_0_16px_rgba(56,189,248,0.15)]'
      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
  ].join(' ');
}

export default function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient background glow, ported from the reference mockups */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-secondary-container/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[400px] bg-surface-container-high/40 rounded-full blur-[120px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/75 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="h-20 max-w-[1280px] mx-auto px-margin-desktop flex items-center justify-between gap-space-md">
          <Link to="/" className="flex items-center gap-space-sm flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[28px]">partly_cloudy_day</span>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              AI WeatherWise
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-space-xs p-1 bg-surface-container-lowest/60 backdrop-blur-md rounded-full">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClasses}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-space-sm flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="hidden md:block font-label-md text-label-md text-on-surface-variant">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="font-label-md text-label-md">Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-space-md py-space-xs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-space-md py-space-xs rounded-full bg-primary text-on-primary-container font-label-lg text-label-lg font-semibold shadow-md hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav -- full responsive polish lands in the dedicated
            responsive-polish step; this keeps the app usable on small
            screens in the meantime. */}
        <nav className="xl:hidden flex items-center gap-space-xs px-margin overflow-x-auto pb-space-sm">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="relative z-10 w-full pt-20 max-w-[1280px] mx-auto px-margin-desktop pb-space-xl">
        {children}
      </main>
    </div>
  );
}
