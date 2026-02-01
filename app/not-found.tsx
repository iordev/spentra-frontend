"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50 flex flex-col justify-center items-center">
      {/* Lottie Animation */}
      <DotLottieReact
        src="https://lottie.host/c8d3d66a-c03f-4edc-a8f5-4382d1e44d48/IxKeF1EH8g.lottie"
        loop
        autoplay
        style={{
          width: "80%", // mobile/tablet
          maxWidth: "600px", // mobile/tablet max
          height: "auto",
          objectFit: "contain",
        }}
        className="lg:w-4/5 lg:max-w-225 xl:w-3/4 xl:max-w-[1100px]"
      />

      {/* Button */}
      <div className="mt-6 w-full flex justify-center px-4">
        <Link href="/overview/dashboard">
          <Button className="bg-white text-black hover:bg-gray-100 shadow-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
