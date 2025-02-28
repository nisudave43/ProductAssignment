import { useState } from "react";
import Toast from "@/component/Toast";

const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string, onCallback?: () => void, duration: number = 3000) => {
    setToastMessage(message);

    setTimeout(() => {
      onCallback?.();
      setToastMessage(null);
    }, duration);
  };

  const ToastComponent = toastMessage ? (
    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
  ) : null;

  return { showToast, ToastComponent };
};

export default useToast;
