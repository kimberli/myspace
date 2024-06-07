import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Karla } from "next/font/google";
import React from "react";

import { ANALYTICS_MEASUREMENT_ID, TAG_MANAGER_ID } from "@/lib/analytics";

import "./globals.css";

import type { Metadata } from "next";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://curious.kim"),
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
      <GoogleTagManager gtmId={TAG_MANAGER_ID} />
      <body className={karla.className}>
        {children}
        {modal}
      </body>
      <GoogleAnalytics gaId={ANALYTICS_MEASUREMENT_ID} />
    </html>
  );
};

export default RootLayout;
