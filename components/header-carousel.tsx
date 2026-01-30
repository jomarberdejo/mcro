"use client";

import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";

export const HeaderCarousel = () => {
  return (
    <div className="relative overflow-hidden py-3 border-y border-blue-200">
      <Splide
        options={{
          type: "loop",
          autoScroll: {
            pauseOnHover: false,
            pauseOnFocus: false,
            rewind: true,
            speed: 0.8,
          },
          arrows: false,
          pagination: false,
          fixedWidth: "max-content",
          direction: "ltr",
          gap: "100rem",
        }}
        extensions={{ AutoScroll }}
      >
        <SplideSlide>
          <div className="flex items-center gap-4 px-8">
            <span className="inline-flex items-center gap-3">
              {/* Philippine flag colors accent */}
              <span className="flex items-center gap-1">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                <span className="w-1 h-8 bg-yellow-400 rounded-full"></span>
              </span>

              <svg
                className="w-6 h-6 text-blue-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="text-blue-800 text-2xl font-bold tracking-wide uppercase">
                WELCOME TO THE MUNICIPAL CIVIL REGISTRAR&apos;S DIGITALIZATION &
                INFORMATION SYSTEM
              </span>

              <span className="flex items-center gap-1">
                <span className="w-1 h-8 bg-yellow-400 rounded-full"></span>
                <span className="w-1 h-8 bg-red-600 rounded-full"></span>
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
              </span>
            </span>
          </div>
        </SplideSlide>
      </Splide>
    </div>
  );
};
