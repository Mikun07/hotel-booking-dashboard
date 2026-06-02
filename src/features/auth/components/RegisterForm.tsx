import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import { useRegisterMutation } from '../hooks/useRegisterMutation';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain a number'),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, error } = useRegisterMutation();

  const apiError = error ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail : null;

  return (
    <form onSubmit={handleSubmit(data => mutate(data))} className="flex flex-col gap-4 w-full">
      <div className="flex gap-3">
        <Input label="First Name" placeholder="Jane" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="Min 8 chars" error={errors.password?.message} {...register('password')} />
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      <Button type="submit" loading={isPending} className="mt-2">Create Account</Button>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-950 font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
