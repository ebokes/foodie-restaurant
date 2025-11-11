import React, { useState } from "react";
import Icon from "@/components/ui/app-icon";

interface Restaurant {
  name: string;
  address: string;
}

interface ReservationData {
  guestCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  seatingPreference: string;
  accessibilityNeeds: boolean;
}

interface ConfirmationModalProps {
  restaurant: Restaurant;
  date: Date;
  time: string;
  reservationData: ReservationData;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  restaurant,
  date,
  time,
  reservationData,
  onClose,
}) => {
  const [confirmationNumber] = useState<string>(() => {
    return `PST-${Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase()}`;
  });

  const formatDate = (date: Date) => {
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const capitalizeWords = (str: string) => {
    return str?.replace(/\b\w/g, (l) => l?.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Reservation Confirmed!
            </h2>
            <p className="text-muted-foreground">
              Your table has been reserved. Here are the details:
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold font-heading text-primary">
                  {confirmationNumber}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Confirmation Number
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Restaurant</span>
                  <span className="font-medium text-foreground">
                    {restaurant?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {formatDate(date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium text-foreground">
                    {reservationData?.guestCount}{" "}
                    {reservationData?.guestCount === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">
                    {reservationData?.firstName} {reservationData?.lastName}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-heading font-bold text-foreground mb-2">
                Additional Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seating</span>
                  <span className="font-medium text-foreground">
                    {capitalizeWords(reservationData?.seatingPreference) ||
                      "No Preference"}
                  </span>
                </div>
                {reservationData?.accessibilityNeeds && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Accessibility Needs
                    </span>
                    <span className="font-medium text-foreground">Yes</span>
                  </div>
                )}
                {reservationData?.specialRequests && (
                  <div>
                    <div className="text-muted-foreground mb-1">Requests</div>
                    <div className="font-medium text-foreground bg-background p-2 rounded text-xs">
                      {reservationData?.specialRequests}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground py-3 px-4 rounded-lg font-body font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-border py-3 px-4 rounded-lg font-body font-medium text-foreground hover:bg-muted transition-colors duration-200"
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
