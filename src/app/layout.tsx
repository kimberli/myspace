import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kim's space",
  description: "Explore Kim's space",
};

interface RootLayoutProps extends React.PropsWithChildren {}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
}: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-[600px]`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
