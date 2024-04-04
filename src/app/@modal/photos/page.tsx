"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/Modal";
import UnderConstruction from "@/components/UnderConstruction";

const ModalPage: React.FC = () => {
  const router = useRouter();
  const onClose = (): void => router.push("/");

  return (
    <Modal title="Photos" onClose={onClose} wide>
      <UnderConstruction />
    </Modal>
  );
};

export default ModalPage;
