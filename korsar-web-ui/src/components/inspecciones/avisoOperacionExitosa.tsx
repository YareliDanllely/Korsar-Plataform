
import { Toast } from "flowbite-react";
import { HiOutlineCheckCircle } from "react-icons/hi";

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <Toast className="p-5 max-w-md rounded-lg shadow-xl border border-korsar-verde-brillante">
      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 text-korsar-verde-brillante">
        <HiOutlineCheckCircle className="h-8 w-8" />
      </div>
      <div className="ml-4 text-lg ">
        {message}
      </div>
      <Toast.Toggle />
    </Toast>
  );
};


export default SuccessToast;


