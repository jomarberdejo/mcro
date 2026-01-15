"use client";

import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import { Building2, ClipboardList, Cross, FileText, Heart } from "lucide-react";

export const HeaderCarousel = () => {
  return (
    <div className="flex h-15 items-center">
        <Splide
          options={{
            type: "loop",
            autoScroll: {
              pauseOnHover: false,
              pauseOnFocus: false,
              rewind: true,
              speed: 1,
            },
            arrows: false,
            pagination: false,
            fixedWidth: "max-content",
            gap: "5rem",
            
          }}
          extensions={{ AutoScroll }}
        >
          <SplideSlide>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 text-lg font-bold drop-shadow-sm">
                Welcome to Civil Registrar Office
              </span>
            </div>
          </SplideSlide>

          <SplideSlide>
            <div className="flex items-center gap-2">
              <span className="text-slate-700 text-lg font-bold drop-shadow-sm">
                LGU Carigara
              </span>
            </div>
          </SplideSlide>

          <SplideSlide>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-slate-700" />
              <span className="text-slate-700 text-lg drop-shadow-sm">
                Birth Certificates
              </span>
            </div>
          </SplideSlide>
          <SplideSlide>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-slate-700" />
              <span className="text-slate-700 text-lg drop-shadow-sm">
                Marriage Certificates
              </span>
            </div>
          </SplideSlide>
          <SplideSlide>
            <div className="flex items-center gap-2">
              <Cross className="w-6 h-6 text-slate-700" />
              <span className="text-slate-700 text-lg drop-shadow-sm">
                Death Certificates
              </span>
            </div>
          </SplideSlide>
          <SplideSlide>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-slate-700" />
              <span className="text-slate-700 text-lg drop-shadow-sm">
                Application for Marriage Certificate
              </span>
            </div>
          </SplideSlide>
        </Splide>
    </div>
  );
};
