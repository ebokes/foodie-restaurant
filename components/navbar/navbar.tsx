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

  useEffect(() => {
    const changeNavColorOnScroll = () =>
      window.scrollY >= 7 ? setNavColor(true) : setNavColor(false);

    window.addEventListener("scroll", changeNavColorOnScroll);

    return () => window.removeEventListener("scroll", changeNavColorOnScroll);
  }, []);

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
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b border-border shadow-sm sticky top-0 z-50"
          : "bg-transparent z-50"
      }`}
    >
      <div className="max-w-[1200px] w-[90%] mx-auto my-1 flex justify-between items-center py-4 ">
        <div className="">
          <Link href={"/"} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Icon name="Salad" size={24} color="white" />
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
        <nav>
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
                  {/* {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon name="X" size={14} />
                  </button>
                )} */}
                </div>
              </form>
            </div>
          </div>
        </nav>

        <div className="flex gap-3">
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
    </header>
  );
};

export default Navbar;
