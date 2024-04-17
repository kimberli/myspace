import classNames from "classnames";
import React from "react";

interface IconButtonProps {
  className?: string;
  disabled?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  outline?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  disabled,
  icon,
  onClick,
  outline,
}: IconButtonProps) => {
  const defaultClasses = "flex items-center justify-center p-0.5 rounded";
  const classes = classNames(
    defaultClasses,
    disabled ? "cursor-default" : "cursor-pointer hover:bg-neutral-500/10",
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
