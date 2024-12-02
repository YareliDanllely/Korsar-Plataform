import { Modal, Button } from "flowbite-react";

interface ConfirmacionModalProps {
  openModal: boolean;
  onConfirm: () => void;
  onClose: () => void;
  mensaje: string; // Mensaje personalizado
}

export function ConfirmacionModalRecepcion({ openModal, onConfirm, onClose, mensaje }: ConfirmacionModalProps) {
  return (
    <Modal show={openModal} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {mensaje}
          </h3>
          <div className="flex justify-center gap-4">
            <Button className="bg-korsar-verde-brillante text-white" onClick={onConfirm}>
              Okey
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
