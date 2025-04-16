import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interflow",
  description: "Advanced video conferencing application.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "/icons/yoom-logo.svg",
          },
          variables: {
            colorText: "#fff",
            colorPrimary: "#0E78F9",
            colorInputBackground: "#252A41",
            colorInputText: "#fff",
          },
        }}
      >
        <body className={`${inter.className} `}> {}
          <ThemeProvider attribute="class" defaultTheme="dark">
          <Toaster />
          {children}
        </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
