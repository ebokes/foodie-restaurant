"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import {
  reservationService,
  ReservationData,
} from "@/lib/firebase/reservations";
import Navbar from "@/components/navbar/navbar";
import FooterSection from "@/components/footer/footer";
import Icon from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";

const MyReservations = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await reservationService.getUserReservations(
          String(user.id)
        );
        setReservations(data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const handleCancel = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    setCancellingId(reservationId);
    try {
      await reservationService.cancelReservation(reservationId);
      // Update local state
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: "cancelled" } : res
        )
      );
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      alert("Failed to cancel reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin w-8 h-8 border-2 border-primary-solid border-t-transparent rounded-full" />
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            My Reservations
          </h1>
          <Button
            as="link"
            href="/table-reservation"
            variant="default"
            iconName="Plus"
          >
            New Reservation
          </Button>
        </div>

        {!user ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="User" size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">
              Sign in to view reservations
            </h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your reservation history.
            </p>
            <Button as="link" href="/sign-in" variant="default">
              Sign In
            </Button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                name="Calendar"
                size={32}
                className="text-muted-foreground"
              />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">
              No reservations yet
            </h2>
            <p className="text-muted-foreground mb-6">
              You haven't made any table reservations yet.
            </p>
            <Button as="link" href="/table-reservation" variant="default">
              Book a Table
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-card border border-border rounded-xl p-6 shadow-warm hover:shadow-warm-lg transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Restaurant Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={reservation.restaurantImage}
                        alt={reservation.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-xl font-heading font-bold text-foreground">
                          {reservation.restaurantName}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {reservation.status.charAt(0).toUpperCase() +
                            reservation.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">
                        {reservation.restaurantAddress}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
                        <div className="flex items-center space-x-1.5">
                          <Icon
                            name="Calendar"
                            size={16}
                            className="text-primary"
                          />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Icon
                            name="Clock"
                            size={16}
                            className="text-primary"
                          />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Icon
                            name="Users"
                            size={16}
                            className="text-primary"
                          />
                          <span>
                            {reservation.guestCount}{" "}
                            {reservation.guestCount === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {reservation.status === "confirmed" && (
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                        onClick={() =>
                          reservation.id && handleCancel(reservation.id)
                        }
                        disabled={cancellingId === reservation.id}
                      >
                        {cancellingId === reservation.id
                          ? "Cancelling..."
                          : "Cancel Reservation"}
                      </Button>
                    )}
                    <Button
                      as="link"
                      href={`/table-reservation?restaurant=${reservation.restaurantId}`}
                      variant="secondary"
                    >
                      Book Again
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <FooterSection />
    </div>
  );
};

export default MyReservations;
