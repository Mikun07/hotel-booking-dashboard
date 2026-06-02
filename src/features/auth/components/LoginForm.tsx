import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import { useLoginMutation } from '../hooks/useLoginMutation';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, error } = useLoginMutation();

  return (
    <form onSubmit={handleSubmit(data => mutate(data))} className="flex flex-col gap-4 w-full">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      {error && (
        <p className="text-sm text-red-600">Invalid email or password.</p>
      )}
      <Button type="submit" loading={isPending} className="mt-2">
        Sign In
      </Button>
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-950 font-medium hover:underline">Register</Link>
      </p>
    </form>
  );
}
