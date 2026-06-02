import React from 'react';
import LoginForm from '../features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-blue-950 mb-1">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to manage your bookings.</p>
      <LoginForm />
    </>
  );
}
