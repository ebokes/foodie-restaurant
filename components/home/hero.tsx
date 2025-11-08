import Image from "next/image";

const Hero = () => {
  return (
    <section className="overflow-hidden min-h-screen relative">
      {/* <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/intecontinental-dish.webp')",
        }}
      > */}
      <div>
        <Image
          src={"/assets/intecontinental-dish.webp"}
          alt="Hero Image"
          fill={true}
          className="object-cover absolute inset-0 z-20"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-30"></div>
        {/* </div> */}
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
            🍽️ Authentic Mediterranean flavors
          </span>
        </div>
        <p className="text-lg text-orange-200 mt-4 font-medium">
          *Limited time offer - Use code:{" "}
          <span className="text-orange-400 font-bold">GOLDEN25</span>
        </p>
      </div>

      {/* <div className="max-w-3xl mx-auto z-40 relative text-center py-32 px-4 sm:px-6 lg:px-8">
        <h1 className="text-8xl font-bold mb-4 text-white">
          Sunny food.{" "}
          <span className="text-yellow-600 block">Golden mood.</span>
        </h1>
        <p className="text-lg text-white mb-10">
          Wholesome Mediterranean meals made fresh daily — bright flavors, bold
          colors, and natural goodness in every bite.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#fresh"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 shadow-md"
          >
            ⚡ Fresh Ingredients Daily
          </a>
          <a
            href="#menu"
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 shadow-md"
          >
            🍽️ Authentic Mediterranean Flavors
          </a>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
