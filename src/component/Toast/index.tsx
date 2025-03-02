// React
import React from 'react';

// Next

// Constants

// Store

// Helpers

// Contexts

// Redux

// Apis

// Action

// Icon

// Layout

// Other components

// Type

// Styles

type ToastProps = {
  message?: string;
  onClose: () => void;
};

/**
 * A toast component that displays a message and a close button.
 *
 * @prop {string} [message] - The message to display in the toast.
 * @prop {() => void} onClose - The function to call when the close button is clicked.
 *
 * @example
 * import { Toast } from '@/component/Toast';
 *
 * <Toast
 *     message="This is a toast!"
 *     onClose={() => console.log('Toast closed!')}
 * />
 */
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed z-1 top-4 right-4 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div className="text-sm font-normal">{message}</div>
            <div className="flex items-center ms-auto space-x-2 rtl:space-x-reverse">
                <button
                    type="button"
                    className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;
