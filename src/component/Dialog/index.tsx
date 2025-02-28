import React from 'react';

type DialogProps = {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
};

const Dialog: React.FC<DialogProps> = ({
    onClose,
    onConfirm,
    title,
    message,
    cancelBtnText = 'Cancel',
    confirmBtnText = 'Confirm'
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
