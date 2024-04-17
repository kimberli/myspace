import classNames from "classnames";
import React from "react";

import Spinner from "@/components/Spinner";

interface ButtonProps extends React.PropsWithChildren {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  loading,
  onClick,
  outline,
  children,
}: ButtonProps) => {
  const defaultClasses =
    "drop-shadow flex items-center justify-center px-2 py-1 rounded select-none";
  const classes = classNames(
    defaultClasses,
    disabled || loading ? "cursor-default" : "cursor-pointer hover:bg-rose-300",
    outline ? "border border-rose-200 bg-white" : "bg-rose-200",
    className,
  );
  return (
    <div className={classes} onClick={disabled ? undefined : onClick}>
      {loading && <Spinner className="absolute" />}
      <div className={classNames(loading && "opacity-0")}>{children}</div>
    </div>
  );
};

export default Button;
