"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import LoginHeader from '@/components/login/login-header';
import LoginForm from '@/components/login/login-form';
import SocialLogin from '@/components/login/social-login';
import Icon from '@/components/ui/app-icon';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setUser, signOutUser, signInUser, signInWithGoogle } from '@/lib/store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Store the intended destination for after login
  useEffect(() => {
    const from = typeof window !== 'undefined' ? window.location.pathname : '/';
    if (from !== '/sign-in') {
      localStorage.setItem('loginRedirect', from);
    }
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }, rememberMe = false) => {
    setIsLoading(true);
    
    try {
      // Use Firebase auth
      await dispatch(signInUser({
        email: credentials.email,
        password: credentials.password,
      })).unwrap();
      
      // Success notification could be added here
      console.log('Login successful');
      
      // Redirect after successful login
      const redirectTo = localStorage.getItem('loginRedirect') || '/';
      localStorage.removeItem('loginRedirect');
      router.push(redirectTo);
      
    } catch (error: any) {
      console.error('Login error:', error);
      // Error is handled by Redux, you can access it via state.auth.error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    
    try {
      if (provider === 'google') {
        await dispatch(signInWithGoogle()).unwrap();
      }
      
      // Redirect after successful login
      const redirectTo = localStorage.getItem('loginRedirect') || '/';
      localStorage.removeItem('loginRedirect');
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(signOutUser()).unwrap();
    localStorage.removeItem('loginRedirect');
    // Stay on login page after logout instead of redirecting
  };

  // If user is already logged in, show option to continue or logout
  const renderLoggedInState = () => (
    <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="User" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          You're already logged in to your account.
        </p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-body font-medium bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          <Icon name="Home" size={16} />
          <span>Continue to Home</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-body font-medium text-foreground hover:text-primary hover:bg-muted border border-border transition-all duration-200"
        >
          <Icon name="LogOut" size={16} />
          <span>Sign in with different account</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Show different content based on login state */}
            {user ? (
              renderLoggedInState()
            ) : (
              <>
                {/* Login Card */}
                <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-8">
                  {/* Header Section */}
                  <LoginHeader />

                  {/* Login Form */}
                  <div className="mt-8">
                    <LoginForm 
                      onLogin={handleLogin}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Social Login */}
                  <div className="mt-8">
                    <SocialLogin 
                      onSocialLogin={handleSocialLogin}
                      isLoading={isLoading}
                    />
                  </div>
                </div>

                {/* Additional Help */}
                <div className="mt-8 text-center">
                  <p className="text-sm font-body text-muted-foreground">
                    Need help? Contact us at{' '}
                    <a 
                      href="tel:+15551234567" 
                      className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                    >
                      (555) 123-4567
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoginPage;