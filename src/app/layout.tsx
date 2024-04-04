import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Karla } from "next/font/google";
import React from "react";

import "./globals.css";

import type { Metadata } from "next";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kim space",
  description: "explore kim's space",
};

interface RootLayoutProps extends React.PropsWithChildren {
  modal: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  children,
  modal,
}: RootLayoutProps) => {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-WN92TN8N" />
      <body className={karla.className}>
        {children}
        {modal}
      </body>
      <GoogleAnalytics gaId="G-GT6NFS8BH3" />
    </html>
  );
};

export default RootLayout;
