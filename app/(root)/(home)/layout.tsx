import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import BackgroundGradients from "./BackgroundGradients";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="bg-[#121218] min-h-screen text-[#e0e0e0] relative overflow-x-hidden">
      <BackgroundGradients />
      <Navbar />

      <section className="pt-[140px] px-[5%] max-w-[1200px] mx-auto pb-12">
        {" "}
        <div className="w-full">{children}</div>
      </section>
    </main>
  );
};

export default RootLayout;
