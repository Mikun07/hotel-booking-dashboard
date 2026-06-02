import React from 'react';
import { Outlet } from 'react-router-dom';
import hotelBg from '../../assets/img/Hotel-header.jpg';
import franceImg from '../../assets/img/France1.jpeg';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={hotelBg} alt="Hotel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-950/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          <div>
            <h1 className="font-extrabold text-3xl text-white tracking-tight">
              Stay<span className="text-amber-400">Ease</span>
            </h1>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Hotel & Resorts</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden h-40 shadow-2xl">
              <img src={franceImg} alt="Resort" className="w-full h-full object-cover" />
            </div>
            <blockquote className="text-white/80 text-sm italic leading-relaxed max-w-xs">
              "Luxury is not about having the best possessions, but the best experiences."
            </blockquote>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {['A','B','C'].map(l => (
                  <span key={l} className="w-7 h-7 rounded-full bg-amber-400/80 text-blue-950 text-xs font-bold flex items-center justify-center ring-2 ring-blue-950/40">
                    {l}
                  </span>
                ))}
              </div>
              <p className="text-white/60 text-xs">Trusted by 10,000+ guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="font-extrabold text-2xl text-blue-950">
              Stay<span className="text-amber-400">Ease</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Hotel Booking & Management</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 border border-gray-100">
            <Outlet />
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} StayEase. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
