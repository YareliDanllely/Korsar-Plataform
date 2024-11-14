import { Modal, Button } from "flowbite-react";

interface ConfirmacionModalProps {
  errorMessage: string | null;
  openModal: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ModalError({ errorMessage, openModal, onConfirm, onClose }: ConfirmacionModalProps) {
  return (
    <Modal show={openModal} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Error en la creación de la anomalia
          </h3>

          <p>{errorMessage}</p>
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
