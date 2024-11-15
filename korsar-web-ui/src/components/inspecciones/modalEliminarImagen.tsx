import { Modal, Button } from "flowbite-react";

// Define el tipo para el objeto imagen
interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  image: Imagen | null;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onClose, onConfirm, image }) => (
  <Modal show={open} onClose={onClose}>
    <Modal.Header>Confirmar eliminación</Modal.Header>
    <Modal.Body>
      <p>¿Estás seguro de que deseas eliminar esta imagen?</p>
      {image && <img src={image.ruta_imagen} alt="Imagen a eliminar" className="mt-4"/>}
    </Modal.Body>
    <Modal.Footer>
      <Button color="failure" onClick={onConfirm}>Sí, eliminar</Button>
      <Button color="gray" onClick={onClose}>Cancelar</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDeleteModal;
