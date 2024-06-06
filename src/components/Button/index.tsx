import classNames from "classnames";
import React from "react";

import { AnalyticsEvent, AnalyticsVariable, trackEvent } from "@/lib/analytics";
import Spinner from "@/components/Spinner";

interface ButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  disabled,
  loading,
  onClick,
  outline,
}: ButtonProps) => {
  const defaultClasses =
    "drop-shadow flex h-8 items-center justify-center px-2 py-1 rounded select-none hover:transition-colors duration-300";
  const classes = classNames(
    defaultClasses,
    disabled || loading ? "cursor-default" : "cursor-pointer hover:bg-rose-300",
    outline ? "border border-rose-200 bg-white" : "bg-rose-200",
    className,
  );
  const trackedOnClick = onClick
    ? (): void => {
        trackEvent(AnalyticsEvent.BUTTON_CLICKED, {
          [AnalyticsVariable.BUTTON_CLICKED]: text,
        });
        onClick();
      }
    : undefined;
  return (
    <div className={classes} onClick={disabled ? undefined : trackedOnClick}>
      {loading && <Spinner className="absolute" />}
      <div className={classNames(loading && "opacity-0")}>{text}</div>
    </div>
  );
};

export default Button;
