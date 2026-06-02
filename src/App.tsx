import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { store } from './store';
import DashboardLayout from './shared/layout/DashboardLayout';
import AuthLayout from './shared/layout/AuthLayout';
import ProtectedRoute from './router/ProtectedRoute';
import RoleRoute from './router/RoleRoute';

import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Main app (dashboard layout) */}
            <Route element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/rooms/search" element={<SearchResultsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />

              {/* Authenticated routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/book/:roomId" element={<BookingPage />} />
                <Route path="/bookings/:id/confirmation" element={<BookingConfirmationPage />} />

                {/* Guest dashboard */}
                <Route element={<RoleRoute allowedRoles={['GUEST', 'STAFF', 'ADMIN']} />}>
                  <Route path="/dashboard" element={<GuestDashboardPage />} />
                </Route>

                {/* Staff dashboard */}
                <Route element={<RoleRoute allowedRoles={['STAFF', 'ADMIN']} />}>
                  <Route path="/staff" element={<StaffDashboardPage />} />
                </Route>

                {/* Admin dashboard */}
                <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
