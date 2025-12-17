"use client";

import Image from "next/image";
import Icon from "../ui/app-icon";
import { Button } from "../ui/button";
import Link from "next/link";
import { menuCategories } from "@/lib/constants";
import { motion } from "motion/react";

const OurMenu = () => {
  return (
    <section id="menu-preview" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="UtensilsCrossed" size={20} className="text-primary" />
            <span className="text-primary font-body font-medium">OUR MENU</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Explore Our <span className="text-primary-solid">Delicious</span>{" "}
            Categories
          </h2>

          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            From hearty burgers to fresh salads, discover a world of flavors
            crafted with passion and the finest ingredients.
          </p>
        </motion.div>

        {/* Menu Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {menuCategories?.map((category, index) => (
            <motion.div
              key={category?.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Featured Badge */}
              {category?.featured && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-body font-bold uppercase tracking-wide flex items-center space-x-1">
                    <Icon name="Star" size={12} />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Item Count Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div
                  className={`${category?.color} ${category?.textColor} px-3 py-1 rounded-full`}
                >
                  <span className="text-sm font-body font-bold">
                    {category?.itemCount} items
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.imageAlt}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Hover Overlay */}
                <Link
                  href="/menu-catalog"
                  className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <div className="bg-card/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Icon
                      name="ArrowRight"
                      size={24}
                      className="text-primary"
                    />
                  </div>
                </Link>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {category?.name}
                </h3>

                <p className="text-muted-foreground font-body mb-4 line-clamp-2">
                  {category?.description}
                </p>

                {/* Action */}
                <Link
                  href="/menu-catalog"
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground font-body">
                    View all items
                  </span>
                  <Icon
                    name="ArrowRight"
                    size={18}
                    className="text-primary group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="tertiary"
            size="lg"
            // onClick={handleViewFullMenu}
            iconName="Menu"
            className="px-8 py-4 hover:scale-105 transition-transform duration-200 shadow-warm-lg"
          >
            View Full Menu
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default OurMenu;
