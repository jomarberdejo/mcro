
"use client";
import { MyDocument } from "@/components/pdf-component";
import React from "react";


import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

const PDF = () => {
  return (
    <div className="h-[800px] w-full">
      <PDFViewer height="100%" width="100%" showToolbar={false}>
        <MyDocument />
      </PDFViewer>
    </div>
  );
};

export default PDF;
