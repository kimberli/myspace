import React from "react";

import Spinner, { SpinnerSize } from "@/components/Spinner";

const LoadingOverlay: React.FC = () => (
  <div className="absolute bg-neutral-800/50 flex items-center justify-center h-dvh w-full top-0 left-0 z-[100]">
    <Spinner size={SpinnerSize.LG} />
  </div>
);

export default LoadingOverlay;
