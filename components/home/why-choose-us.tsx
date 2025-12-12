"use client";

import { features } from "@/lib/constants";
import { motion } from "motion/react";
import Icon from "../ui/app-icon";

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="Award" size={20} className="text-primary" />
            <span className="text-primary font-body font-medium">
              WHY CHOOSE US
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            What Makes Us <span className="text-primary-solid">Special</span>
          </h2>

          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            We&apos;re committed to delivering exceptional dining experiences
            through quality, service, and passion for great food.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-warm transition-all duration-300 text-center hover:-translate-y-2 hover:shadow-warm-lg"
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-linear-to-br from-primary-solid via-grad1 to-grad2 group-hover:scale-110 transition-all duration-300">
                  <Icon
                    name={feature?.icon}
                    size={32}
                    className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature?.title}
              </h3>

              <p className="text-muted-foreground font-body leading-relaxed">
                {feature?.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "50+", label: "Menu Items" },
            { number: "5★", label: "Average Rating" },
            { number: "24/7", label: "Service Available" },
          ]?.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">
                {stat?.number}
              </div>
              <div className="text-muted-foreground font-body">
                {stat?.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyChooseUsSection;
