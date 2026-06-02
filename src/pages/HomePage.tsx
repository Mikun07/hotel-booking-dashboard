import React from 'react';
import { Link } from 'react-router-dom';
import RoomSearchForm from '../features/rooms/components/RoomSearchForm';
import { useRoomList } from '../features/rooms/hooks/useRoomSearch';
import RoomCard from '../features/rooms/components/RoomCard';
import Spinner from '../shared/ui/Spinner';
import Button from '../shared/ui/Button';
import { useAuth } from '../shared/hooks/useAuth';
import hotelHeader from '../assets/img/Hotel-header.jpg';
import hotelImg2 from '../assets/img/Hotel-2.jpeg';
import hotelImg3 from '../assets/img/Hotel-3.jpeg';
import londonImg from '../assets/img/London.jpeg';
import franceImg from '../assets/img/France.jpeg';
import istanbulImg from '../assets/img/istanbul.jpeg';

const destinations = [
  { name: 'London', img: londonImg, hotels: '240+ hotels' },
  { name: 'Paris', img: franceImg, hotels: '180+ hotels' },
  { name: 'Istanbul', img: istanbulImg, hotels: '120+ hotels' },
];

const perks = [
  { icon: 'shield-checkmark-outline', title: 'Secure Booking', desc: 'Your payment and data are always protected.' },
  { icon: 'star-outline', title: 'Best Rates', desc: 'Price-match guarantee on every room.' },
  { icon: 'headset-outline', title: '24/7 Support', desc: 'Our team is here whenever you need us.' },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'New York, US',
    date: 'May 2025',
    rating: 5,
    roomType: 'Suite',
    color: '#6366f1',
    review: 'Absolutely stunning experience from check-in to check-out. The suite was immaculate and the staff went above and beyond to make our anniversary special.',
  },
  {
    name: 'James Okonkwo',
    location: 'Lagos, NG',
    date: 'Apr 2025',
    rating: 5,
    roomType: 'Penthouse',
    color: '#0ea5e9',
    review: 'The penthouse view was breathtaking. Booking through StayEase was seamless I had my confirmation in under a minute. Will absolutely return.',
  },
  {
    name: 'Aiko Tanaka',
    location: 'Tokyo, JP',
    date: 'Apr 2025',
    rating: 4,
    roomType: 'Double',
    color: '#f43f5e',
    review: 'Great value for a double room in such a premium property. The bed was incredibly comfortable and the breakfast selection was exceptional.',
  },
  {
    name: 'Luca Ferretti',
    location: 'Milan, IT',
    date: 'Mar 2025',
    rating: 5,
    roomType: 'Suite',
    color: '#10b981',
    review: 'I travel for business every month and StayEase has become my go-to. The cancellation policy is flexible and the rooms are always exactly as pictured.',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai, IN',
    date: 'Mar 2025',
    rating: 5,
    roomType: 'Single',
    color: '#f59e0b',
    review: 'Even the single room felt luxurious. Quiet, clean, and brilliantly located. The StayEase app made managing my booking effortless.',
  },
  {
    name: 'Carlos Mendez',
    location: 'Madrid, ES',
    date: 'Feb 2025',
    rating: 4,
    roomType: 'Double',
    color: '#8b5cf6',
    review: 'Fantastic staff and an amazing rooftop pool. Only minor thing was the Wi-Fi could be faster, but everything else was a 10/10. Highly recommend.',
  },
];

export default function HomePage() {
  const { data, isLoading } = useRoomList();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* ── Hero ── */}
      <div className="relative rounded-3xl overflow-hidden min-h-[380px] flex items-end">
        <img
          src={hotelHeader}
          alt="Hotel lobby"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 w-full px-8 py-10 flex flex-col gap-4">
          <div className="max-w-xl">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">Premium Hotel Experience</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Find Your<br />Perfect Stay
            </h1>
            <p className="text-white/70 text-sm mt-3 max-w-sm">
              Discover handpicked rooms, book instantly, and manage every stay all from one place.
            </p>
            {!isAuthenticated && (
              <div className="flex gap-3 mt-5">
                <Link to="/register">
                  <Button size="lg" className="!bg-amber-400 !text-gray-900 hover:!bg-amber-300 font-bold">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="!text-white !border !border-white/40 hover:!bg-white/10 backdrop-blur-sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search card ── */}
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/80 border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 rounded-full bg-amber-400 inline-block" />
          <h2 className="font-bold text-gray-900 text-lg">Search Available Rooms</h2>
        </div>
        <RoomSearchForm />
      </div>

      {/* ── Popular destinations ── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 rounded-full bg-amber-400 inline-block" />
          <h2 className="font-bold text-gray-900 text-lg">Popular Destinations</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {destinations.map(d => (
            <Link key={d.name} to="/rooms/search" className="relative rounded-2xl overflow-hidden group h-48 block">
              <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">{d.name}</p>
                <p className="text-white/70 text-xs">{d.hotels}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Featured rooms ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-amber-400 inline-block" />
            <h2 className="font-bold text-gray-900 text-lg">Featured Rooms</h2>
          </div>
          <Link to="/rooms/search" className="text-sm font-semibold text-amber-500 hover:text-amber-600 flex items-center gap-1">
            View all <ion-icon name="arrow-forward-outline" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data?.items ?? []).slice(0, 6).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>

      {/* ── Why StayEase ── */}
      <div className="relative rounded-3xl overflow-hidden">
        <img src={hotelImg2} alt="Hotel pool" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-950/85" />
        <div className="relative z-10 px-8 py-10">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-2xl font-bold text-white mb-8">The StayEase Difference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {perks.map(p => (
              <div key={p.title} className="flex flex-col gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                  <ion-icon name={p.icon} style={{ color: '#fbbf24', fontSize: '22px' }} />
                </div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-white/60 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Customer testimonials ── */}
      <div>
        <div className="flex flex-col items-center text-center mb-8">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Guest Reviews</p>
          <h2 className="text-2xl font-extrabold text-gray-900">What Our Guests Say</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md">Real experiences from real guests unedited and honest.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md shadow-gray-200/50 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <ion-icon
                    key={s}
                    name={s < t.rating ? 'star' : 'star-outline'}
                    style={{ fontSize: '14px', color: s < t.rating ? '#f59e0b' : '#d1d5db' }}
                  />
                ))}
              </div>
              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.review}"</p>
              {/* Divider */}
              <div className="border-t border-gray-100" />
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location} · {t.date}</p>
                </div>
                <span className="ml-auto text-xs font-semibold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full capitalize">{t.roomType}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating bar */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-extrabold text-gray-900">4.8</p>
            <div className="flex justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <ion-icon key={i} name="star" style={{ fontSize: '15px', color: '#f59e0b' }} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Based on 2,400+ reviews</p>
          </div>
          <div className="flex-1 w-full flex flex-col gap-2">
            {[
              { label: 'Cleanliness', pct: 96 },
              { label: 'Service',     pct: 94 },
              { label: 'Location',    pct: 91 },
              { label: 'Value',       pct: 89 },
            ].map(bar => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 flex-shrink-0">{bar.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">{bar.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Explore gallery strip ── */}
      <div className="grid grid-cols-3 gap-3 h-48">
        <img src={hotelImg3} alt="Hotel" className="w-full h-full object-cover rounded-2xl" />
        <img src={hotelImg2} alt="Hotel" className="w-full h-full object-cover rounded-2xl" />
        <img src={hotelHeader} alt="Hotel" className="w-full h-full object-cover rounded-2xl" />
      </div>
    </div>
  );
}
