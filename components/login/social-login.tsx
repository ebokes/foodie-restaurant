"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginProps {
  onSocialLogin: (userData: any) => Promise<void>;
  isLoading?: boolean;
}

interface MockUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatarAlt: string;
  provider?: string;
}

interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  mockUser: MockUser;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin, isLoading = false }) => {
  const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'Chrome',
    color: 'bg-white border-2 border-border text-foreground hover:bg-muted',
    mockUser: {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
      avatarAlt: 'Professional headshot of smiling woman with shoulder-length blonde hair in white blouse',
      provider: 'google'
    }
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    color: 'bg-blue-600 text-white hover:bg-blue-700',
    mockUser: {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@facebook.com',
      avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
      avatarAlt: 'Professional headshot of Asian man with black hair and glasses in dark suit',
      provider: 'facebook'
    }
  }];


  const handleSocialLogin = async (provider: SocialProvider) => {
    if (isLoading) return;

    // Simulate social login process
    try {
      // In a real app, this would redirect to OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await onSocialLogin(provider.mockUser);
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground font-body">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            disabled={isLoading}
            className={`${provider.color} transition-all duration-200 hover:scale-102`}
            iconName={provider.icon as any}>
            {provider.name}
          </Button>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs font-body text-muted-foreground">
          By signing in, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );

};

export default SocialLogin;