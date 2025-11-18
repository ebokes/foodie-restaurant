"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/app-icon';

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }, rememberMe?: boolean) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
  [key: string]: string | undefined;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Pass credentials to parent component for Firebase authentication
    await onLogin(
      { email: formData.email, password: formData.password },
      formData.rememberMe
    );

    // Note: Redirect is now handled by the parent component after login completion
  };

  const handleForgotPassword = () => {
    // In a real app, this would navigate to forgot password page
    alert('Forgot password functionality would be implemented here');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
            <p className="text-sm font-body text-error">{errors.general}</p>
          </div>
        </div>
      )}
      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        className="w-full" />

      {/* Password Input */}
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
        className="w-full" />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange} />

        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors duration-200">

          Forgot password?
        </button>
      </div>
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={isLoading}
        className="mt-8 w-full">
        Sign In
      </Button>
      {/* Sign Up Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm font-body text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/sign-up')}
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
            Sign up here
          </button>
        </p>
      </div>
    </form>
  );

};

export default LoginForm;