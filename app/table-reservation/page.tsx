"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmationModal from "@/components/table-reservation/confirmation-modal";
import DateTimePicker from "@/components/table-reservation/date-time-picker";
import ReservationForm from "@/components/table-reservation/reservation-form";
import RestaurantSelector from "@/components/table-reservation/restaurant-selector";
import Icon from "@/components/ui/app-icon";
import Navbar from "@/components/navbar/navbar";
import FooterSection from "@/components/footer/footer";
import { reservationService } from "@/lib/firebase/reservations";
import { useAppSelector } from "@/lib/store/hooks";
import { motion } from "motion/react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
  imageAlt: string;
  capacity: number;
  features: string[];
}

interface FormData {
  guestCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  seatingPreference: string;
  accessibilityNeeds: boolean;
}

const TableReservation = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({
    guestCount: 2,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    seatingPreference: "no-preference",
    accessibilityNeeds: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Restaurant Locations
  const restaurants = [
    {
      id: "downtown",
      name: "Foodies Downtown",
      address: "123 Main Street, Downtown District",
      hours: "Mon-Sun: 11:00 AM - 10:00 PM",
      capacity: 120,
      image: "https://images.unsplash.com/photo-1672870634122-6ea7b16d2bb4",
      imageAlt:
        "Modern restaurant interior with warm lighting and elegant table settings",
      phone: "(555) 123-4567",
      features: ["Valet Parking", "Wine Bar", "Private Dining"],
    },
    {
      id: "waterfront",
      name: "Foodies Waterfront",
      address: "456 Harbor View, Marina District",
      hours: "Mon-Sun: 5:00 PM - 11:00 PM",
      capacity: 80,
      image: "https://images.unsplash.com/photo-1542066681-3129a81d8cab",
      imageAlt:
        "Elegant waterfront restaurant with floor-to-ceiling windows overlooking harbor",
      phone: "(555) 123-4568",
      features: ["Ocean View", "Outdoor Seating", "Live Music"],
    },
    {
      id: "garden",
      name: "Foodies Garden",
      address: "789 Green Valley Road, Garden District",
      hours: "Tue-Sun: 12:00 PM - 9:00 PM",
      capacity: 60,
      image: "https://images.unsplash.com/photo-1507447204628-759dc3244a96",
      imageAlt:
        "Charming garden restaurant with outdoor terrace surrounded by lush greenery",
      phone: "(555) 123-4569",
      features: ["Garden Terrace", "Farm-to-Table", "Pet Friendly"],
    },
    {
      id: "rooftop",
      name: "Foodies Rooftop",
      address: "321 Sky Tower, Uptown District",
      hours: "Wed-Sun: 4:00 PM - 12:00 AM",
      capacity: 95,
      image: "https://images.unsplash.com/photo-1730644285465-1ea941bc5f27",
      imageAlt:
        "Stunning rooftop restaurant with city skyline views and modern outdoor dining setup",
      phone: "(555) 123-4570",
      features: ["City Views", "Rooftop Bar", "Late Night Dining"],
    },
    {
      id: "suburban",
      name: "Foodies Suburban",
      address: "654 Oak Hills Boulevard, Westside",
      hours: "Mon-Sun: 10:00 AM - 9:00 PM",
      capacity: 140,
      image: "https://images.unsplash.com/photo-1673993446533-2e1429bf42dc",
      imageAlt:
        "Spacious suburban restaurant with family-friendly atmosphere and comfortable booth seating",
      phone: "(555) 123-4571",
      features: ["Family Friendly", "Large Groups", "Playground"],
    },
    {
      id: "historic",
      name: "Foodies Historic",
      address: "987 Heritage Square, Old Town",
      hours: "Tue-Sat: 5:00 PM - 10:00 PM",
      capacity: 50,
      image: "https://images.unsplash.com/photo-1640618675149-23fc9c5ff85a",
      imageAlt:
        "Intimate historic restaurant in restored brick building with vintage decor and cozy ambiance",
      phone: "(555) 123-4572",
      features: ["Historic Building", "Intimate Setting", "Fine Dining"],
    },
  ];

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const user = useAppSelector((state) => state.auth.user);

  const handleReservationSubmit = async (formData: FormData) => {
    if (!selectedRestaurant || !selectedDate || !selectedTime) return;

    setLoading(true);
    setReservationData(formData);

    try {
      await reservationService.createReservation(
        {
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          restaurantAddress: selectedRestaurant.address,
          restaurantImage: selectedRestaurant.image,
          date: selectedDate.toISOString(),
          time: selectedTime,
          ...formData,
        },
        user?.id ? String(user.id) : undefined
      );

      setLoading(false);
      setShowConfirmation(true);
    } catch (error) {
      toast.error("Failed to create reservation");
      setLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Reset form or navigate to another page
    setCurrentStep(1);
    setSelectedRestaurant(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3]?.map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-white border-2 transition-all duration-200 ${
              step <= currentStep
                ? "bg-linear-to-br from-primary-solid via-grad1 to-grad2 border-primary text-primary-foreground"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {step < currentStep ? (
              <Icon name="Check" size={16} />
            ) : (
              <span className="font-body font-medium">{step}</span>
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                step < currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RestaurantSelector
            restaurants={restaurants}
            onSelect={handleRestaurantSelect}
          />
        );

      case 2:
        if (!selectedRestaurant) {
          setCurrentStep(1);
          return null;
        }
        return (
          <DateTimePicker
            restaurant={selectedRestaurant}
            onSelect={handleDateTimeSelect}
            onBack={() => setCurrentStep(1)}
          />
        );

      case 3:
        if (!selectedRestaurant || !selectedDate || !selectedTime) {
          setCurrentStep(2);
          return null;
        }
        return (
          <ReservationForm
            restaurant={selectedRestaurant}
            date={selectedDate}
            time={selectedTime}
            onSubmit={handleReservationSubmit}
            onBack={() => setCurrentStep(2)}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center">
              <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
                Reserve Your Table
              </h1>
              <p className="text-lg lg:text-xl font-body opacity-90 max-w-2xl mx-auto">
                Book your perfect dining experience at any of our Foodies
                locations. Choose your preferred restaurant, date, and time for
                an unforgettable meal.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Reservation Content */}
        <section className="py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-warm">
              {renderStepContent()}
            </div>
          </motion.div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-muted py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-warm">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Calendar" size={24} color="#4C1D0A" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
                Need Help with Your Reservation?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team is here to assist you with special requests, large
                parties, or any questions about your dining experience. Call us
                directly for personalized service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground rounded-lg font-body font-medium hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                >
                  <Icon name="Phone" size={18} />
                  <span>Call (555) 123-4567</span>
                </a>
                <button
                  onClick={() => router.push("/menu-catalog")}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-body font-medium hover:bg-accent/90 transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  <Icon name="Menu" size={18} />
                  <span>View Menu</span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
      {/* Confirmation Modal */}
      {showConfirmation &&
        selectedRestaurant &&
        selectedDate &&
        selectedTime && (
          <ConfirmationModal
            restaurant={selectedRestaurant}
            date={selectedDate}
            time={selectedTime}
            reservationData={reservationData}
            onClose={handleConfirmationClose}
          />
        )}
    </div>
  );
};

export default TableReservation;
