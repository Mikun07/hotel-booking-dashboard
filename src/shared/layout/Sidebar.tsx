import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { useIsDesktop } from '../hooks/useMediaQuery';
import DP from '../../assets/img/Dp.jpg';

interface MenuItem { id: number; name: string; link: string; icon: string; roles?: string[]; }

const allMenus: MenuItem[] = [
  { id: 1, name: 'Home', link: '/', icon: 'home' },
  { id: 2, name: 'Search Rooms', link: '/rooms/search', icon: 'search' },
  { id: 3, name: 'My Bookings', link: '/dashboard', icon: 'calendar', roles: ['GUEST'] },
  { id: 4, name: 'Staff Dashboard', link: '/staff', icon: 'people', roles: ['STAFF', 'ADMIN'] },
  { id: 5, name: 'Admin Dashboard', link: '/admin', icon: 'settings', roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [navOpen, setNavOpen] = useState(false);

  const visibleMenus = allMenus.filter(m =>
    !m.roles || (isAuthenticated && user && m.roles.includes(user.role))
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <h1 className="font-extrabold text-xl text-blue-950 tracking-tight">
          Stay<span className="text-amber-400">Ease</span>
        </h1>
        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Hotel & Resorts</p>
      </div>

      {/* Profile */}
      {isAuthenticated && user ? (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <img
            src={DP}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 ring-offset-1 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
            <span className="text-[11px] text-amber-500 font-semibold capitalize">{user.role.toLowerCase()}</span>
          </div>
        </div>
      ) : (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400">Welcome, Guest</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {visibleMenus.map(({ id, link, name, icon }) => (
            <li key={id}>
              <NavLink
                to={link}
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-white/15' : 'bg-gray-100'}`}>
                      <ion-icon name={icon} style={{ fontSize: '16px', color: isActive ? '#fff' : '#6b7280' }} />
                    </span>
                    {name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout / Sign in */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <ion-icon name="log-out-outline" style={{ fontSize: '16px', color: '#ef4444' }} />
            </span>
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-950 hover:bg-blue-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ion-icon name="log-in-outline" style={{ fontSize: '16px', color: '#172554' }} />
            </span>
            Sign In
          </NavLink>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="bg-white w-60 min-h-screen flex flex-col border-r border-gray-100 shadow-sm">
        <SidebarContent />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="bg-white w-[42px] h-[42px] rounded-xl text-gray-500 shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <ion-icon name="menu" size="large"></ion-icon>
      </button>
      {navOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10" onClick={() => setNavOpen(false)} />
          <div className="bg-white w-60 h-screen flex flex-col fixed top-0 left-0 z-20 shadow-2xl">
            <SidebarContent />
          </div>
        </>
      )}
    </div>
  );
}
