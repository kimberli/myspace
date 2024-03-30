import { Karla } from "next/font/google";
import React from "react";

import "./globals.css";

import type { Metadata } from "next";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kim space",
  description: "explore kim's space",
};

interface RootLayoutProps extends React.PropsWithChildren {}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
}: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={karla.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
