import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="h-16 w-full flex items-center justify-between px-1 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ion-icon name="search-outline" style={{ fontSize: '16px' }} />
          </span>
          <input
            type="search"
            placeholder="Search rooms, destinations..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <ion-icon name="calendar-outline" style={{ fontSize: '13px' }} />
          {today}
        </span>

        <button className="relative w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
          <ion-icon name="notifications-outline" style={{ fontSize: '17px' }} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {user && (
          <div className="hidden lg:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="w-6 h-6 rounded-full bg-blue-950 text-white text-xs flex items-center justify-center font-bold">
              {user.firstName[0]}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {user.firstName} {user.lastName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
