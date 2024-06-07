import React, { useEffect, useState } from "react";
import classNames from "classnames";

import Button from "@/components/Button";

interface CopyButtonProps {
  buttonText: string;
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  buttonText,
  textToCopy,
}: CopyButtonProps) => {
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col items-center relative w-full">
      <Button
        onClick={() =>
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => setShowToast(true))
        }
        text={buttonText}
      />
      <div
        className={classNames(
          "absolute top-4 bg-rose-100 p-1 text-xs transform transition-all duration-300 ease-in-out",
          showToast
            ? "opacity-100 translate-y-full"
            : "opacity-0 translate-y-1",
        )}
      >
        Copied to clipboard!
      </div>
    </div>
  );
};

export default CopyButton;
