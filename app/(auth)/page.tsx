"use client";

import React from "react";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/feautures-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FooterSection } from "@/components/landing/footer-section";
import { NavigationSection } from "@/components/landing/navigation-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationSection />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
