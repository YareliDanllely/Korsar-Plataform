import { Modal, Button } from "flowbite-react";

interface ConfirmacionModalProps {
  openModal: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmacionModal({ openModal, onConfirm, onClose, message }: ConfirmacionModalProps) {
  return (
    <Modal
    show={openModal} size="md" popup={true} onClose={onClose}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"

    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
           {message}
          </h3>
          <div className="flex justify-center gap-4">
          <Button className="bg-korsar-verde-brillante text-white" onClick={onConfirm}>
            Sí, enviar
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancelar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
