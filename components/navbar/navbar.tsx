"use client";

import Icon from "../ui/app-icon";
import type { IconProps } from "../ui/app-icon";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [navColor, setNavColor] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const changeNavColorOnScroll = () =>
      window.scrollY >= 7 ? setNavColor(true) : setNavColor(false);

    window.addEventListener("scroll", changeNavColorOnScroll);

    return () => window.removeEventListener("scroll", changeNavColorOnScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
    // Close search after submission
    setIsSearchOpen(false);
  };

  const navigationItems: {
    label: string;
    path: string;
    icon: IconProps["name"];
    variant: "default" | "ghost" | "outline";
  }[] = [
    {
      label: "Home",
      path: "/",
      icon: "Home" as IconProps["name"],
      variant: "ghost",
    },
    {
      label: "Menu",
      path: "/menu-catalog",
      icon: "UtensilsCrossed" as IconProps["name"],
      variant: "ghost",
    },
    {
      label: "Reservations",
      path: "/table-reservation",
      icon: "Calendar" as IconProps["name"],
      variant: "ghost",
    },
  ];

  return (
    <header
      className={`${
        navColor
          ? " bg-white sticky top-0 z-50 shadow-lg"
          : "z-50 backdrop-blur"
      }`}
    >
      <div className="max-w-[1200px] w-[90%] mx-auto my-1 flex justify-between items-center py-4 ">
        <div className="">
          <Link href={"/"} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Icon name="Salad" size={24} color="white" className="" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-bold text-primary">
                Foodies
              </h1>
              <p className="text-xs font-caption text-muted-foreground -mt-1">
                Restaurant
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile Icons - Cart and Search */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <Icon name="Search" size={20} className="text-foreground" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => router.push("/shopping-cart")}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <Icon name="ShoppingCart" size={20} className="text-foreground" />
          </button>

          {/* Hamburger Menu */}
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-1 ml-2 z-70 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Search Bar - Appears when search is open */}
        {isSearchOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 z-50">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu..."
                  className="w-full pl-10 pr-10 py-2 text-sm font-body bg-muted border border-transparent rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all duration-200"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <div className="flex justify-between gap-3">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                iconName={item.icon}
                onClick={() => router.push(item.path)}
                variant={"ghost"}
              >
                <span>{item.label}</span>
              </Button>
            ))}
            {/* Search bar */}
            <div className="relative">
              <form className="relative">
                <div
                  className={`relative flex items-center transition-all duration-200`}
                >
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    className="w-48 pl-10 pr-10 py-2 text-sm font-body bg-muted border border-transparent rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-all duration-200"
                  />
                </div>
              </form>
            </div>
          </div>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex gap-3">
          <Button
            iconName="ShoppingCart"
            onClick={() => router.push("/shopping-cart")}
            variant={"ghost"}
          >
            Cart
          </Button>
          <Button
            iconName="LogIn"
            variant={"outline"}
            onClick={() => router.push("/sign-in")}
          >
            Sign In
          </Button>
          <Button iconName="UserPlus" onClick={() => router.push("/sign-up")}>
            Sign Up
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-background z-60 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Link href={"/"} className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-primary-solid via-grad1 to-grad2 rounded-lg flex items-center justify-center">
              <Icon name="Salad" size={32} color="white" className="" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary mt-2">
              Foodies
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Restaurant
            </p>
          </Link>

          <nav className="flex flex-col items-center gap-6 w-full">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                iconName={item.icon}
                onClick={() => {
                  router.push(item.path);
                  setIsMenuOpen(false);
                }}
                variant={"ghost"}
                className="text-xl py-3 w-64 justify-center"
                size="lg"
              >
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          <div className="flex flex-col gap-4 w-64 mt-8">
            <Button
              iconName="ShoppingCart"
              onClick={() => {
                router.push("/shopping-cart");
                setIsMenuOpen(false);
              }}
              variant={"ghost"}
              className="text-xl py-3 justify-center"
              size="lg"
            >
              Cart
            </Button>
            <Button
              iconName="LogIn"
              variant={"outline"}
              onClick={() => {
                router.push("/sign-in");
                setIsMenuOpen(false);
              }}
              className="text-xl py-3 justify-center"
              size="lg"
            >
              Sign In
            </Button>
            <Button
              iconName="UserPlus"
              onClick={() => {
                router.push("/sign-up");
                setIsMenuOpen(false);
              }}
              className="text-xl py-3 justify-center"
              size="lg"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
