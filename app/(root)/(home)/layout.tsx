import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
// Removed Sidebar import

export const metadata: Metadata = {
  title: 'Interflow', // Updated title to match project name
  description: 'Advanced video conferencing application.', // Updated description
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative bg-dark-2"> {/* Added a base dark background */}
      <Navbar />

      {/* Removed the outer flex div and the Sidebar component */}
      <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14"> {/* Kept pt-28 for now, adjust if needed */}
        <div className="w-full">{children}</div>
      </section>
    </main>
  );
};

export default RootLayout;
