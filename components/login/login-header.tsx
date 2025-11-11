"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon, { type IconProps } from '@/components/ui/app-icon';

const LoginHeader = () => {
  const router = useRouter();

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="w-16 h-16 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-warm">
            <Icon name="Salad" size={32} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-heading font-bold text-primary">Foodies</h1>
            <p className="text-sm font-caption text-muted-foreground -mt-1">Restaurant</p>
          </div>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Welcome Back
        </h2>
        <p className="text-lg font-body text-muted-foreground max-w-md mx-auto">
          Sign in to your account to access your order history and personalized recommendations
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {BenefitData.map((benefit) => (
          <BenefitItem key={benefit.title} icon={benefit.icon} title={benefit.title} iconColor={benefit.iconColor} />
        ))}
      </div>
    </div>
  );
};

export default LoginHeader;

const BenefitData: Array<{
  icon: IconProps['name'];
  title: string;
  iconColor: string;
}> = [
  {
    icon: 'Clock',
    title: 'Quick Reorder',
    iconColor: 'text-primary-solid',
  },
  {
    icon: 'Heart',
    title: 'Save Favorites',
    iconColor: 'text-success',
  },
  {
    icon: 'Gift',
    title: 'Exclusive Offers',
    iconColor: 'text-primary',
  },
];

const BenefitItem = ({ icon, title, iconColor }: { icon: IconProps['name']; title: string; iconColor: string }) => {
  return (
    <div className="flex items-center space-x-1 text-sm font-body text-muted-foreground">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Icon name={icon} size={20} className={iconColor} />
      </div>
      <span>{title}</span>
    </div>
  );
};