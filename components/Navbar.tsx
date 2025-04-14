"use client"; // Add 'use client' because we'll use hooks

import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation"; // Import usePathname
import { sidebarLinks } from "@/constants"; // Import sidebarLinks
import { cn } from "@/lib/utils"; // Import cn for conditional classes

const Navbar = () => {
  const pathname = usePathname(); // Get current path

  return (
    // Revert to wider width, adjust padding for larger profile pic
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1100px] flex justify-between items-center px-6 py-3 backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl z-50 shadow-lg">
      <Link
        href="/"
        className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 flex-shrink-0"
      >
        {" "}
        {/* Added flex-shrink-0 */}
        <Image // Added the missing <Image tag opening
          src="/icons/logo.svg"
          alt="Interflow Logo"
          width={32}
          height={32}
          className="max-sm:size-8"
        />
        <p className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
          Interflow
        </p>
      </Link>

      {/* Desktop Navigation Links - Hidden on small screens */}
      <div className="hidden md:flex items-center gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.startsWith(link.route) && link.route !== "/");

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition duration-300 ${
                isActive
                  ? "text-cyan-400 bg-cyan-400/10 shadow-inner shadow-cyan-400/20 font-semibold"
                  : "text-[#a0a0a0] hover:text-[#e0e0e0] hover:bg-white/10"
              }`}
            >
              {/* <Image
                src={link.imgURL}
                alt={link.label}
                width={20} // Slightly larger icon
                height={20}
              /> */}
              {link.icon}
              <span className="tracking-wide">{link.label}</span>{" "}
            </Link>
          );
        })}
      </div>

      {/* Right side elements: User Button and Mobile Nav */}
      <div className="flex items-center gap-4">
        {" "}
        {/* Reduced gap slightly */}
        <SignedIn>
          {/* Apply custom styles to make UserButton larger */}
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10", // Increase size
              },
            }}
          />
        </SignedIn>
        {/* MobileNav is kept for smaller screens */}
        <div className="md:hidden">
          {" "}
          {/* Hide MobileNav trigger on medium screens and up */}
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
