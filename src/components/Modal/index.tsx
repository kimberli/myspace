import { HiOutlineXMark } from "react-icons/hi2";
import React from "react";

import IconButton from "@/components/IconButton";

interface ModalProps extends React.PropsWithChildren {
  title: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  title,
  onClose,
}: ModalProps) => {
  return (
    <>
      <div
        className="absolute bg-neutral-800/50 h-dvh w-full top-0 left-0 z-[100]"
        onClick={onClose}
      ></div>
      <div className="absolute min-h-64 h-auto min-w-80 w-1/2 bg-neutral-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded z-[200]">
        <IconButton
          className="float-right"
          onClick={onClose}
          icon={<HiOutlineXMark />}
        />

        <h1 className="mb-4 text-center text-xl">{title}</h1>
        {children}
      </div>
    </>
  );
};

export default Modal;
