import classNames from "classnames";
import { HiOutlineXMark } from "react-icons/hi2";
import React from "react";

import IconButton from "@/components/IconButton";

interface ModalProps extends React.PropsWithChildren {
  title: string;
  onClose: () => void;
  wide?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  onClose,
  wide,
}: ModalProps) => {
  const classes = classNames(wide ? "w-11/12" : "w-1/2");
  return (
    <>
      <div
        className="absolute bg-neutral-800/50 h-dvh w-full top-0 left-0 z-[100]"
        onClick={wide ? null : onClose}
      ></div>
      <div
        className={classNames(
          "absolute min-h-64 h-auto max-h-[98dvh] min-w-80 bg-neutral-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded z-[200] overflow-y-scroll",
          classes,
        )}
      >
        <IconButton
          className="fixed top-0 right-0 m-4"
          onClick={onClose}
          icon={<HiOutlineXMark />}
        />
        <div className="p-8">
          <h1 className="mb-4 text-center text-xl">{title}</h1>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
