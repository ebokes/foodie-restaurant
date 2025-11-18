"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Icon, { type IconProps } from '@/components/ui/app-icon';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { signOutUser } from '@/lib/store/slices/authSlice';

interface User {
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string;
  avatarAlt?: string;
}

interface NavbarProps {
  cartCount?: number;
  user?: User | null;
  onCartClick?: () => void;
  onAccountClick?: (action: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount: propCartCount, 
  user: propUser = null, 
  onCartClick, 
  onAccountClick, 
  onLogout, 
  onSearch 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.items);
  const reduxCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = propCartCount !== undefined ? propCartCount : reduxCartCount;
  const reduxUser = useAppSelector((state) => state.auth.user);
  
  // Use prop user if provided, otherwise use Redux user
  const user = propUser !== null ? propUser : (reduxUser ? {
    id: typeof reduxUser.id === 'number' ? reduxUser.id : undefined,
    name: reduxUser.name,
    email: reduxUser.email,
    avatar: reduxUser.avatar,
    avatarAlt: reduxUser.avatarAlt
  } : null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  
  const navigationItems: Array<{
    label: string;
    path: string;
    icon: IconProps['name'];
  }> = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Menu', path: '/menu-catalog', icon: 'UtensilsCrossed' },
    { label: 'Reservations', path: '/table-reservation', icon: 'Calendar' },
  ];

  const isActivePath = (path: string): boolean => {
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      router.push('/shopping-cart');
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    if (onAccountClick) {
      onAccountClick('login');
    } else {
      router.push('/sign-in');
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignUp = () => {
    if (onAccountClick) {
      onAccountClick('register');
    } else {
      router.push('/sign-up');
    }
    setIsMobileMenuOpen(false);
  };

  const handleUserProfileClick = () => {
    if (onAccountClick) {
      onAccountClick('account');
    } else {
      router.push('/user-account');
    }
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    await dispatch(signOutUser()).unwrap();
    router.push('/sign-in');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu-catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen && !isUserDropdownOpen) {
      return; // Don't set up listeners if nothing is open
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on mobile menu button or inside mobile menu
      const isClickOnMenuButton = target.closest('.mobile-menu-button') !== null;
      const isClickInsideMenu = target.closest('.mobile-menu') !== null;
      
      if (isMobileMenuOpen && !isClickOnMenuButton && !isClickInsideMenu) {
        setIsMobileMenuOpen(false);
      }
      
      // Don't close if clicking on user profile button or inside user dropdown
      const isClickOnUserButton = target.closest('.user-profile-button') !== null;
      const isClickInsideUserDropdown = target.closest('.user-dropdown') !== null;
      
      if (isUserDropdownOpen && !isClickOnUserButton && !isClickInsideUserDropdown) {
        setIsUserDropdownOpen(false);
      }
    };

    // Use a small timeout to avoid conflicts with button onClick
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
            <div className="w-10 h-10 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Icon name="Salad" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
                <h1 className="text-xl font-heading font-bold text-primary">Foodies</h1>
                <p className="text-xs font-caption text-muted-foreground -mt-1">Restaurant</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 hover:bg-muted hover:scale-102 cursor-pointer ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Search Filter */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className={`relative flex items-center transition-all duration-200 ${
                  isSearchFocused ? 'scale-102' : ''
                }`}>
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search menu..."
                    className="w-48 pl-10 pr-10 py-2 text-sm font-body bg-muted border border-transparent rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 hover:bg-muted hover:scale-102 cursor-pointer ${
                isActivePath('/shopping-cart')
                  ? 'text-primary bg-primary/10' :'text-foreground hover:text-primary'
              }`}
            >
              <Icon name="ShoppingCart" size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Conditional Rendering: User Profile or Auth Buttons */}
            {user ? (
              /* User Profile Section */
              (<div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="user-profile-button flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-body font-medium text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                >
                  {user?.avatar && user.avatar.trim() !== '' ? (
                    <img
                      src={user.avatar}
                      alt={user?.avatarAlt || `Profile picture of ${user?.name || user?.email}`}
                      className="w-8 h-8 rounded-full object-cover border border-border"
                      onError={(e) => {
                        // Hide image on error and show fallback
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 rounded-full bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground flex items-center justify-center text-xs font-bold ${user?.avatar && user.avatar.trim() !== '' ? 'hidden' : ''}`}
                  >
                    {user?.name ? user?.name?.charAt(0)?.toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="user-dropdown absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-warm-lg overflow-hidden z-50">
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center space-x-3">
                        {user?.avatar && user.avatar.trim() !== '' ? (
                          <img
                            src={user.avatar}
                            alt={user?.avatarAlt || `Profile picture of ${user?.name || user?.email}`}
                            className="w-10 h-10 rounded-full object-cover border border-border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-10 h-10 rounded-full bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground flex items-center justify-center text-sm font-bold ${user?.avatar && user.avatar.trim() !== '' ? 'hidden' : ''}`}
                        >
                          {user?.name ? user?.name?.charAt(0)?.toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleUserProfileClick}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <Icon name="User" size={16} />
                        <span>My Account</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/order-tracking');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <Icon name="Package" size={16} />
                        <span>Order Tracking</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/table-reservation');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-foreground hover:bg-muted transition-colors duration-200"
                      >
                        <Icon name="Calendar" size={16} />
                        <span>My Reservations</span>
                      </button>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-body text-error hover:bg-error/10 transition-colors duration-200"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>)
            ) : (
              /* Authentication Buttons */
              (<>
                <button
                  onClick={handleSignIn}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body font-medium text-foreground hover:text-primary hover:bg-muted border border-border transition-all duration-200 cursor-pointer"
                >
                  <Icon name="LogIn" size={16} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={handleSignUp}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body font-medium bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                >
                  <Icon name="UserPlus" size={16} />
                  <span>Sign Up</span>
                </button>
              </>)
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => router.push('/menu-catalog')}
              className="p-2 rounded-lg text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
            >
              <Icon name="Search" size={20} />
            </button>

            {/* Mobile Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-lg text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="mobile-menu-button p-2 rounded-lg text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu fixed top-16 right-0 h-full w-80 max-w-[90vw] bg-card border-l border-border shadow-warm-xl z-50 transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Mobile Search */}
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 text-muted-foreground pointer-events-none" 
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search menu..."
                  className="w-full pl-10 pr-10 py-3 text-sm font-body bg-muted border border-transparent rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            </form>
            </div>

          {/* Mobile Navigation Items */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium transition-all duration-200 hover:bg-muted ${
                  isActivePath(item.path)
                    ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Auth/User Section */}
          <div className="mt-8 pt-6 border-t border-border">
            {user ? (
              /* Mobile User Profile Section */
              (<>
                <h3 className="text-sm font-body font-medium text-muted-foreground mb-3">Account</h3>
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user?.avatar && user.avatar.trim() !== '' ? (
                      <img
                        src={user.avatar}
                        alt={user?.avatarAlt || `Profile picture of ${user?.name || user?.email}`}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-12 h-12 rounded-full bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground flex items-center justify-center text-lg font-bold ${user?.avatar && user.avatar.trim() !== '' ? 'hidden' : ''}`}
                    >
                      {user?.name ? user?.name?.charAt(0)?.toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleUserProfileClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    <Icon name="User" size={20} />
                    <span>My Account</span>
                  </button>
                  <button
              onClick={() => {
                      router.push('/order-tracking');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    <Icon name="Package" size={20} />
                    <span>Order Tracking</span>
                  </button>
                  <button
              onClick={() => {
                      router.push('/table-reservation');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    <Icon name="Calendar" size={20} />
                    <span>My Reservations</span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium text-error hover:bg-error/10 transition-all duration-200"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>)
            ) : (
              /* Mobile Auth Buttons */
              (<>
                <h3 className="text-sm font-body font-medium text-muted-foreground mb-3">Account</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleSignIn}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    <Icon name="LogIn" size={20} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-body font-medium bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                  >
                    <Icon name="UserPlus" size={20} />
                    <span>Sign Up</span>
                  </button>
                </div>
              </>)
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-3 text-sm font-body text-muted-foreground">
              <Icon name="Phone" size={16} />
              <span>Call us: (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;