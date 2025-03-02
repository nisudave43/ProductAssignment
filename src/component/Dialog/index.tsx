import React from 'react';

type DialogProps = {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
};

/**
 * Dialog component renders a modal dialog with a title, message, and action buttons.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Callback function to handle dialog close action.
 * @param {function} props.onConfirm - Callback function to handle confirmation action.
 * @param {string} props.title - The title text displayed in the dialog.
 * @param {string} props.message - The message text displayed in the dialog.
 * @param {string} [props.cancelBtnText='Cancel'] - Text for the cancel button.
 * @param {string} [props.confirmBtnText='Confirm'] - Text for the confirm button.
 *
 * @returns JSX.Element - The rendered dialog component.
 */

const Dialog: React.FC<DialogProps> = ({
    onClose,
    onConfirm,
    title,
    message,
    cancelBtnText = 'Cancel',
    confirmBtnText = 'Confirm',
}) => {
    return (
        <div className="fixed inset-0 z-1 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-2">{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 cursor-pointer text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        {cancelBtnText}
                    </button>
                    <button
                        className="px-4 py-2 cursor-pointer text-white bg-red-600 rounded-lg hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        {confirmBtnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
