"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import Icon from "../ui/app-icon";
import { specialDeals } from "@/lib/constants";
const LimitedOffers = () => {
  

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
            <Icon name="Zap" size={20} className="text-accent" />
            <span className="text-accent font-body font-medium">
              LIMITED TIME OFFERS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Special <span className="text-primary-solid">Deals</span> This Week
          </h2>

          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Don&apos;t miss out on these amazing offers! Limited time deals that
            bring you the best value for your favorite meals.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialDeals?.map((deal) => (
            <div
              key={deal?.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300"
            >
              {/* New Badge */}
              {deal?.isNew && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-error text-error-foreground px-3 py-1 rounded-full text-xs font-body font-bold uppercase tracking-wide">
                    NEW
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              <div
                className={`absolute top-4 right-4 z-20 ${deal?.bgColor} ${deal?.textColor} px-3 py-1 rounded-full`}
              >
                <span className="text-sm font-body font-bold">
                  {deal?.discount}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal?.image}
                  alt={deal?.imageAlt}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                    {deal?.title}
                  </h3>
                  <p className="text-primary font-body font-medium">
                    {deal?.subtitle}
                  </p>
                </div>

                <p className="text-muted-foreground font-body mb-4 line-clamp-2">
                  {deal?.description}
                </p>

                {/* Valid Until */}
                <div className="flex items-center space-x-2 mb-4">
                  <Icon
                    name="Clock"
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground font-body">
                    Valid until: {deal?.validUntil}
                  </span>
                </div>

                {/* Action Button */}
                <Button

                  variant="tertiary"
                  size="sm"
                  iconName="ArrowRight"
                  className="w-full group-hover:bg-linear-to-br from-primary-solid via-grad1 to-grad2 group-hover:text-white"
                >
                  Claim Deal
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-12">
          <Button
            variant="secondary"
            size="lg"
            iconName="Gift"
            className="px-8 py-4 hover:scale-105 transition-transform duration-200"
          >
            View All Deals
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LimitedOffers;
