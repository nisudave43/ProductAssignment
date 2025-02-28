import { useState } from "react";
import Toast from "@/component/Toast";

const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const ToastComponent = toastMessage ? (
    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
  ) : null;

  return { showToast, ToastComponent };
};

export default useToast;
