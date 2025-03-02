import { useState } from 'react';
import Toast from '@/component/Toast';

/**
 * Hook to show a toast message.
 *
 * @returns An object with two properties. showToast is a function that shows
 * a toast message with a given message, an optional callback function and an
 * optional duration. ToastComponent is a component that renders the toast
 * message.
 *
 * @example
 * const { showToast, ToastComponent } = useToast();
 *
 * showToast('This is a toast message');
 *
 * // Render the toast message
 * <ToastComponent />
 */
const useToast = () => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    /**
     * Shows a toast message.
     *
     * @param message The message to show
     * @param onCallback An optional callback function to call when the toast message is closed
     * @param duration The duration of the toast message in milliseconds, defaults to 3000
     */
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
