import classNames from "classnames";
import { HiOutlineXMark } from "react-icons/hi2";
import React from "react";

import IconButton from "@/components/IconButton";

interface ModalProps extends React.PropsWithChildren {
  className?: string;
  title: string;
  onClose: () => void;
  fullSize?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  title,
  onClose,
  fullSize,
}: ModalProps) => {
  const classes = classNames(
    fullSize
      ? "w-11/12 max-w-[1200px] h-[90dvh]"
      : "min-w-80 w-1/2 min-h-64 h-auto max-h-[90dvh]",
  );
  return (
    <>
      <div
        className="absolute bg-neutral-800/50 h-dvh w-full top-0 left-0 z-[100]"
        onClick={fullSize ? undefined : onClose}
      ></div>
      <div
        className={classNames(
          "absolute bg-neutral-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded z-[200]",
          classes,
        )}
      >
        <IconButton
          className="fixed top-0 right-0 m-4"
          onClick={onClose}
          icon={<HiOutlineXMark />}
        />
        <div className={classNames("p-6 h-full", className)}>
          <h1 className="mb-4 text-center text-xl">{title}</h1>
          <div className="p-2 overflow-y-scroll">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
