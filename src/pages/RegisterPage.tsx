import React from 'react';
import RegisterForm from '../features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-blue-950 mb-1">Create an account</h2>
      <p className="text-sm text-gray-500 mb-6">Start booking hotels in minutes.</p>
      <RegisterForm />
    </>
  );
}
