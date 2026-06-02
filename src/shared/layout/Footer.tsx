import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Explore: [
    { label: 'Browse Rooms', to: '/rooms/search' },
    { label: 'Book a Stay', to: '/rooms/search' },
    { label: 'My Bookings', to: '/dashboard' },
  ],
  Company: [
    { label: 'About StayEase', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Press', to: '/' },
  ],
  Support: [
    { label: 'Help Center', to: '/' },
    { label: 'Contact Us', to: '/' },
    { label: 'Privacy Policy', to: '/' },
  ],
};

const socials = [
  { icon: 'logo-twitter', label: 'Twitter' },
  { icon: 'logo-instagram', label: 'Instagram' },
  { icon: 'logo-facebook', label: 'Facebook' },
  { icon: 'logo-linkedin', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white mt-auto">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">Ready for your next stay?</p>
            <p className="text-white/50 text-sm mt-0.5">Discover handpicked rooms at the best rates.</p>
          </div>
          <Link
            to="/rooms/search"
            className="flex-shrink-0 bg-amber-400 text-blue-950 font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-2"
          >
            <ion-icon name="search-outline" style={{ fontSize: '16px' }} />
            Browse Rooms
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight">
              Stay<span className="text-amber-400">Ease</span>
            </h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Hotel & Resorts</p>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            Premium hotel booking and management search rooms, book instantly, manage every stay from one place.
          </p>
          <div className="flex items-center gap-3 mt-1">
            {socials.map(s => (
              <button
                key={s.label}
                aria-label={s.label}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-amber-400 hover:text-blue-950 transition-all duration-200"
              >
                <ion-icon name={s.icon} style={{ fontSize: '15px' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">{title}</p>
            <ul className="flex flex-col gap-2">
              {links.map(l => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/60 hover:text-amber-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} StayEase Hotel & Resorts. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Terms', 'Privacy', 'Cookies'].map(t => (
              <Link key={t} to="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
