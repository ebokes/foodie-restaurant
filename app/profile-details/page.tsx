"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import Icon from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateUser, signOutUser } from '@/lib/store/slices/authSlice';
import { auth, db } from '@/lib/firebase/config';
import { userService } from '@/lib/firebase/user';
import { doc, setDoc } from 'firebase/firestore';

import ProfileAvatarSection from '@/components/profile-details/profile-avatar-section';
import PersonalInfoSection from '@/components/profile-details/personal-info-section';
import ContactInfoSection from '@/components/profile-details/contact-info-section';
import AddressInfoSection from '@/components/profile-details/address-info-section';
import AccountSecuritySection from '@/components/profile-details/account-security-section';

interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  marketing: boolean;
}

interface User {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string | null;
  avatarAlt?: string | null;
  joinDate?: string;
  lastLogin?: string;
  bio?: string;
  alternativeEmail?: string;
  preferences?: UserPreferences;
  addresses?: Address[];
}

const ProfileDetails = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  
  // Initialize user state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    if (!reduxUser) {
      router.push('/sign-in');
      return;
    }

    const loadUserData = async () => {
      if (!auth.currentUser) {
        router.push('/sign-in');
        return;
      }

      setIsLoading(true);
      const userId = auth.currentUser.uid;

      try {
        // Load user profile from Redux
        setUser({
          id: reduxUser.id,
          name: reduxUser.name,
          email: reduxUser.email,
          phone: reduxUser.phone,
          dateOfBirth: reduxUser.dateOfBirth,
          avatar: reduxUser.avatar,
          avatarAlt: reduxUser.avatarAlt,
          joinDate: reduxUser.joinDate,
          lastLogin: reduxUser.lastLogin,
          bio: reduxUser.bio,
          preferences: reduxUser.preferences ? {
            newsletter: reduxUser.preferences.newsletter ?? false,
            notifications: reduxUser.preferences.notifications ?? false,
            marketing: reduxUser.preferences.marketing ?? false
          } : undefined,
          addresses: reduxUser.addresses,
        });

        // Load addresses from Firebase if not in Redux
        if (!reduxUser.addresses || reduxUser.addresses.length === 0) {
          const userAddresses = await userService.getAddresses(userId);
          setUser((prev) => prev ? { ...prev, addresses: userAddresses } : null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router, reduxUser]);

  // Save changes handler
  const handleSaveChanges = async () => {
    if (!user || !auth.currentUser) return;

    setIsLoading(true);
    try {
      const userId = auth.currentUser.uid;

      // Update user document in Firestore
      await setDoc(
        doc(db, 'users', userId),
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar || null,
          avatarAlt: user.avatarAlt || null,
          joinDate: user.joinDate,
          lastLogin: user.lastLogin,
          bio: user.bio,
          preferences: user.preferences,
          addresses: user.addresses || []
        },
        { merge: true }
      );

      // Update Redux store - convert User to UserData format
      dispatch(updateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar || undefined,
        avatarAlt: user.avatarAlt || undefined,
        joinDate: user.joinDate,
        lastLogin: user.lastLogin,
        bio: user.bio,
        preferences: user.preferences,
        addresses: user.addresses
      }));

      setHasUnsavedChanges(false);

      // Show success message (you could add a toast notification here)
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUserLocal = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  // Update addresses
  const updateAddresses = async (addresses: Address[]) => {
    if (!auth.currentUser) return;

    setUser((prev) => prev ? { ...prev, addresses } : null);
    setHasUnsavedChanges(true);

    // Save to Firebase immediately
    try {
      await userService.updateAddresses(auth.currentUser.uid, addresses);
      dispatch(updateUser({ addresses }));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  // Header handlers
  const handleLogout = async () => {
    await dispatch(signOutUser()).unwrap();
    router.push('/sign-in');
  };

  // Navigation warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Convert user to Navbar-compatible format
  const navbarUser = user ? {
    id: typeof user.id === 'string' ? parseInt(user.id.replace(/\D/g, '')) || undefined : user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || undefined,
    avatarAlt: user.avatarAlt || undefined
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={navbarUser} />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-body text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={navbarUser}
        onLogout={handleLogout}
        onCartClick={() => router.push('/shopping-cart')}
        onSearch={() => {}}
        onAccountClick={(action: string) => {
          if (action === 'logout') handleLogout();
          else if (action === 'account') router.push('/user-account');
        }} />


      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm font-body text-muted-foreground mb-6">
            <button
              onClick={() => router.push('/user-account')}
              className="hover:text-primary transition-colors duration-200"
            >
              My Account
            </button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground">Profile Details</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Profile Details</h1>
              <p className="text-lg font-body text-muted-foreground mt-1">
                Manage your personal information and preferences
              </p>
            </div>
            
            {hasUnsavedChanges &&
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                  <Icon name="AlertCircle" size={16} className="text-warning" />
                  <span className="text-sm font-body text-warning">Unsaved changes</span>
                </div>
                <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                iconName={isLoading ? "Loader2" : "Check"}
                className={isLoading ? "animate-spin" : ""}
              >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            }
          </div>

          {/* Profile Content */}
          <div className="space-y-8">
            {/* Profile Avatar Section */}
            <ProfileAvatarSection
              user={{
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                avatarAlt: user.avatarAlt
              }}
              onUpdateUser={updateUserLocal} />


            {/* Personal Information Section */}
            <PersonalInfoSection
              user={user}
              onUpdateUser={updateUserLocal} />


            {/* Contact Information Section */}
            <ContactInfoSection
              user={user}
              onUpdateUser={updateUserLocal} />


            {/* Address Information Section */}
            <AddressInfoSection
              addresses={user?.addresses || []}
              onUpdateAddresses={updateAddresses} />


            {/* Account Security Section */}
            <AccountSecuritySection
              user={{
                id: user.id ? String(user.id) : undefined,
                lastLogin: user.lastLogin
              }}
              onUpdateUser={updateUserLocal} />

          </div>

          {/* Floating Save Button for Mobile */}
          {hasUnsavedChanges &&
          <div className="fixed bottom-6 right-6 sm:hidden z-40">
              <Button
              onClick={handleSaveChanges}
              disabled={isLoading}
              iconName={isLoading ? "Loader2" : "Check"}
              size="lg"
              className={`shadow-warm-lg ${isLoading ? "animate-spin" : ""}`}
            >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          }

          {/* Back to Account Button */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button
              variant="outline"
              iconName="ArrowLeft"
              onClick={() => router.push('/user-account')}
            >
              Back to My Account
            </Button>
          </div>
        </div>
      </div>
    </div>);

};

export default ProfileDetails;