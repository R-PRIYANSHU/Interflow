"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface HomeCardProps {
  className?: string; // Keep className for potential additional styling if needed
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
  iconBgColor?: string; // New prop for icon background color
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
  iconBgColor,
}: HomeCardProps) => {
  return (
    <section
      className={cn(
        // Base styles: Glassmorphism, dark bg, padding, flex, size, rounded corners, cursor, transition
        "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer",
        "glass-bg glass-border backdrop-blur-lg", // Glassmorphism effect
        "transition-all duration-300 ease-in-out", // Smooth transitions
        "hover:scale-[1.03] hover:border-sky-400 hover:shadow-lg hover:shadow-sky-400/20", // Hover effects: scale, border highlight, glow
        className // Allow overriding/adding classes
      )}
      onClick={handleClick}
      data-testid={title}
    >
      {/* Icon container: Use iconBgColor prop, ensure centering */}
      <div className={cn("flex-center size-12 rounded-[10px]", iconBgColor)}>
        <Image src={img} alt={title} width={27} height={27} />
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-lg font-normal text-gray-300">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;
