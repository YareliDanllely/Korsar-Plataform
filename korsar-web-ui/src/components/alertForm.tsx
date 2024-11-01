import { Alert } from "flowbite-react";

export function ErrorAlert({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <Alert color="failure" onDismiss={onClose}>
      <span>{message}</span>
    </Alert>
  );
}
