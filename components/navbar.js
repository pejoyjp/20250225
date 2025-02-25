"use client"
import React, { useState } from "react";
import BoldFont from "./boldLink";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center max-w-screen-xl w-full mx-auto p-4">

      <div className="flex items-center gap-2">
        <Image src="/logo.png" width={50} height={50} alt="" />
        <BoldFont>PDF.ai</BoldFont>
      </div>

     
      <div className="hidden md:flex gap-4">
        <BoldFont>Pricing</BoldFont>
        <BoldFont>Chrome extension</BoldFont>
        <BoldFont>Use cases</BoldFont>
        <BoldFont>Get started →</BoldFont>
      </div>

   
      <button
        className="md:hidden flex flex-col gap-1 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`block h-0.5 w-6 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`block h-0.5 w-6 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
        <span className={`block h-0.5 w-6 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>


      <div
        className={`absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center gap-4 p-6 transition-all ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <BoldFont>Pricing</BoldFont>
        <BoldFont>Chrome extension</BoldFont>
        <BoldFont>Use cases</BoldFont>
        <BoldFont>Get started →</BoldFont>
      </div>
    </div>
  );
};

export default Navbar;
