"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginProps {
  onSocialLogin: (provider: string) => Promise<void>;
  isLoading?: boolean;
}



interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;

}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin, isLoading = false }) => {
  const socialProviders: SocialProvider[] = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-white border-2 border-border text-foreground hover:bg-muted',

    },
   ];


  const handleSocialLogin = async (provider: SocialProvider) => {
    if (isLoading) return;

    try {
      // Pass provider ID to parent component for Firebase authentication
      await onSocialLogin(provider.id);
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
      <div >
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            disabled={isLoading}
            className={`${provider.color} w-full transition-all duration-200 hover:scale-102`}
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