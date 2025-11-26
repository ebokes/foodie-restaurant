"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="overflow-hidden min-h-screen relative">
      <div>
        <Image
          src={"/assets/intecontinental-dish.webp"}
          alt="Hero Image"
          fill={true}
          className="object-cover absolute inset-0 z-20"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-30"></div>
      </div>
      <div className="relative"> </div>
      <div className="max-w-3xl mx-auto z-40 relative text-center py-32 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-bold text-white leading-tight mb-8 drop-shadow-2xl">
          Sunny food.
          <br />
          <span className="text-orange-400">Golden mood.</span>
        </h1>
        <p className="text-2xl sm:text-3xl lg:text-4xl text-white font-semibold mb-4 drop-shadow-lg">
          🎉 Grand Opening Special! 🎉
        </p>
        <p className="text-xl sm:text-2xl text-orange-100 font-medium mb-6 drop-shadow-md">
          Get{" "}
          <span className="text-orange-400 font-bold text-2xl sm:text-3xl">
            25% OFF
          </span>{" "}
          your first order +
          <span className="text-white font-bold"> FREE delivery</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-lg sm:text-xl text-white">
          <span className="bg-orange-500/80 px-4 py-2 rounded-full backdrop-blur-sm">
            ⚡ Fresh ingredients daily
          </span>
          <span className="bg-orange-500/80 px-4 py-2 rounded-full backdrop-blur-sm">
            🍽️ Tasty food for you
          </span>
        </div>
        <p className="text-lg text-orange-200 mt-4 font-medium">
          *Limited time offer - Use code:{" "}
          <span className="text-orange-400 font-bold">GOLDEN25</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
          <Button
            as="link"
            variant="destructive"
            size="lg"
            className="text-xl px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300 border-0"
            href="/table-reservation"
          >
            Make Reservation
          </Button>

          <Button
            as="link"
            variant="outline"
            size="lg"
            className="text-xl px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-lg shadow-2xl hover:scale-105 transition-all duration-300"
            href="/menu-catalog"
          >
            Order Online
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
