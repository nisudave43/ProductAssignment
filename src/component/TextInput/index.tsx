import React, { ReactNode } from "react";

type TextInputProps = {
  label?: string;
  id: string;
  placeholder?: string;
  icon?: ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string,
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextInput: React.FC<TextInputProps> = ({ label, id, placeholder, icon, onChange, type = "text", ...props }) => {
  return (
    <>
        {label && (
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
        )}
        <div className="relative">
            <div className={`absolute inset-y-0 start-0 flex items-center ps-4 ${icon ? 'pointer-events-none' : 'w-10'}`}>
                {icon && <span className="me-2">{icon}</span>}
            </div>
            <input
                type={type}
                id={id}
                className="bg-transparent border border-gray-300 text-gray-900 text-lg font-normal rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-1.75 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                onChange={onChange}
                {...props}
            />
      </div>
    </>
  );
};

export default TextInput;