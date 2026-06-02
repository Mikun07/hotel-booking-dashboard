import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import DP from '../../assets/img/Dp.jpg';

interface MenuItem { id: number; name: string; link: string; icon: string; roles?: string[]; }

const allMenus: MenuItem[] = [
  { id: 1, name: 'Home',            link: '/',              icon: 'home-outline' },
  { id: 2, name: 'Rooms',           link: '/rooms/search',  icon: 'bed-outline' },
  { id: 3, name: 'My Bookings',     link: '/dashboard',     icon: 'calendar-outline',    roles: ['GUEST'] },
  { id: 4, name: 'Staff',           link: '/staff',         icon: 'people-outline',      roles: ['STAFF', 'ADMIN'] },
  { id: 5, name: 'Admin',           link: '/admin',         icon: 'settings-outline',    roles: ['ADMIN'] },
];

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleMenus = allMenus.filter(m =>
    !m.roles || (isAuthenticated && user && m.roles.includes(user.role))
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm shadow-gray-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex flex-col leading-none">
          <span className="font-extrabold text-xl text-blue-950 tracking-tight">
            Stay<span className="text-amber-400">Ease</span>
          </span>
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Hotel & Resorts</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleMenus.map(({ id, link, name, icon }) => (
            <NavLink
              key={id}
              to={link}
              end={link === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-950 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <ion-icon name={icon} style={{ fontSize: '15px' }} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* Right side: auth actions */}
        <div className="flex items-center gap-2">
          {/* Notifications — only when logged in */}
          {isAuthenticated && (
            <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <ion-icon name="notifications-outline" style={{ fontSize: '17px' }} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>
          )}

          {/* Desktop: user dropdown or sign-in/register */}
          {isAuthenticated && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <img src={DP} alt="avatar" className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400" />
                <span className="text-sm font-semibold text-gray-800">{user.firstName}</span>
                <ion-icon name={profileOpen ? 'chevron-up-outline' : 'chevron-down-outline'} style={{ fontSize: '13px', color: '#9ca3af' }} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-amber-500 font-semibold capitalize">{user.role.toLowerCase()}</p>
                    </div>
                    <div className="py-1.5">
                      {visibleMenus.map(({ id, link, name, icon }) => (
                        <Link
                          key={id}
                          to={link}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <ion-icon name={icon} style={{ fontSize: '15px' }} />
                          {name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <ion-icon name="log-out-outline" style={{ fontSize: '15px' }} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 text-sm font-bold bg-blue-950 text-white rounded-xl hover:bg-blue-900 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <ion-icon name={mobileOpen ? 'close-outline' : 'menu-outline'} style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl">
            {/* Mobile drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
              <span className="font-extrabold text-lg text-blue-950">
                Stay<span className="text-amber-400">Ease</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <ion-icon name="close-outline" style={{ fontSize: '18px' }} />
              </button>
            </div>

            {/* User info */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <img src={DP} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-amber-500 font-semibold capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
            )}

            {/* Mobile nav links */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              <ul className="flex flex-col gap-1">
                {visibleMenus.map(({ id, link, name, icon }) => (
                  <li key={id}>
                    <NavLink
                      to={link}
                      end={link === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive ? 'bg-blue-950 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/15' : 'bg-gray-100'}`}>
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

            {/* Mobile auth footer */}
            <div className="px-3 pb-6 border-t border-gray-100 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <ion-icon name="log-out-outline" style={{ fontSize: '16px', color: '#ef4444' }} />
                  </span>
                  Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Sign In</button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-bold bg-blue-950 text-white hover:bg-blue-900 transition-colors">Get Started</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
