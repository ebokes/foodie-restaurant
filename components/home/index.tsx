import Navbar from "../navbar/navbar";
import Hero from "./hero";
import LimitedOffers from "./limited-offers";
import OurMenu from "./our-menu";
import WhyChooseUs from "./why-choose-us";
import Testimonials from "./testimonials";
import Footer from "../footer/footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <LimitedOffers />
      <OurMenu />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;
