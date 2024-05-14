import classNames from "classnames";
import React from "react";

interface IconButtonProps {
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  outline?: boolean;
  transparent?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  disabled,
  icon,
  onClick,
  outline,
  transparent,
}: IconButtonProps) => {
  const defaultClasses = "flex h-8 items-center justify-center p-0.5 rounded";
  const classes = classNames(
    !transparent && "bg-rose-200",
    defaultClasses,
    disabled
      ? "cursor-default"
      : transparent
        ? "cursor-pointer hover:bg-neutral-500/10"
        : "cursor-pointer hover:bg-rose-300",
    outline && "border border-neutral-800",
    className,
  );
  return (
    <div className={classes} onClick={disabled ? undefined : onClick}>
      {icon}
    </div>
  );
};

export default IconButton;
