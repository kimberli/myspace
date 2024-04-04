"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/Modal";

const ModalPage: React.FC = () => {
  const router = useRouter();
  const onClose = (): void => router.push("/");

  return (
    <Modal title="About" onClose={onClose}>
      <div className="mx-4">
        <p className="mb-2">
          Welcome to my space! I created this during a period of nomadic
          traveling, imagining it as my little home on the Internet.
        </p>
        <p className="mb-2">
          Feel free to explore, or just settle in and make yourself comfortable.
        </p>
        <p className="mb-2">
          To learn more about me, visit my personal website at{" "}
          <a href="https://kimberli.me" target="_blank">
            kimberli.me
          </a>
          .
        </p>
        <p className="mb-2 text-right">- Kim</p>
      </div>
    </Modal>
  );
};

export default ModalPage;
