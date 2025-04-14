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
    <nav className="flex items-center justify-between fixed z-50 top-0 left-6 right-6 mt-6 rounded-full bg-dark-1/25 backdrop-blur-lg border border-gray-700/30 px-6 py-4 lg:px-8 transition-all duration-300 ease-in-out"> {/* Removed max-w/mx-auto, added left/right, changed py-5->4 */}
      {/* Logo Link */}
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
        <p className="text-2xl font-extrabold text-white max-sm:hidden">
          Interflow
        </p>
      </Link>

      {/* Desktop Navigation Links - Hidden on small screens */}
      <div className="hidden md:flex items-center gap-2">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.startsWith(link.route) && link.route !== "/");

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                "flex items-center gap-2.5 rounded-full px-5 py-2.5 text-base font-medium text-gray-300 transition-all duration-300 ease-in-out transform border-2 border-transparent", // Added transparent border base
                {
                  // Active state: Keep similar enhanced style
                  "bg-sky-500/50 text-white shadow-lg shadow-sky-400/60 border-sky-500/70": isActive,
                  // New Hover state: Brighter background fill, white text, subtle border highlight
                  "hover:bg-sky-600/60 hover:text-white hover:border-sky-400/80 hover:shadow-md hover:shadow-sky-400/30": !isActive, // Removed translate, changed bg/border/shadow
                }
              )}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20} // Slightly larger icon
                height={20}
              />
              <span className="tracking-wide">{link.label}</span> {/* Added tracking */}
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
