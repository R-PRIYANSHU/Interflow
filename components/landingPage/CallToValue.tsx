import React from "react";
import { Button } from "@/components/ui";

export default function CallToValue() {
  return (
    <div className="w-[70%] flex flex-col items-center mt-28 py-16 px-8 bg-muted rounded-2xl">
      <h1 className="text-[2rem] font-semibold mt-4">
        Start Your Free Meeting Today
      </h1>
      <p className="text-muted-foreground text-lg">
        Experience the power of seamless video conferencing.
      </p>
      <Button
        variant={"default"}
        className="w-60 rounded-full mt-8 py-6 text-lg font-medium"
      >
        Get Started
      </Button>
    </div>
  );
}
