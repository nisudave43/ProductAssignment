// React
import React, { ReactNode } from 'react';

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

type TextInputProps = {
  label?: string;
  id: string;
  name: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * A text input component.
 *
 * @prop {string} label - The label of the text input.
 * @prop {string} id - The HTML id of the text input.
 * @prop {string} name - The HTML name of the text input.
 * @prop {string} [placeholder] - The placeholder text of the text input.
 * @prop {ReactNode} [icon] - The icon to display at the start of the text input.
 * @prop {string} [error] - The error message to display below the text input.
 * @prop {(event: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - The function to call when the value of the text input changes.
 * @prop {string} [type] - The type of the text input, defaults to "text".
 *
 * @example
 * <TextInput
 *     label="Email address"
 *     id="email"
 *     name="email"
 *     placeholder="e.g. example@gmail.com"
 *     icon={<EmailIcon />}
 *     error="Please enter a valid email address"
 *     onChange={(event) => console.log(event.target.value)}
 * />
 */
const TextInput: React.FC<TextInputProps> = ({
    label,
    id,
    name,
    placeholder,
    icon,
    error,
    onChange,
    type = 'text',
    ...props
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
                    name={name}
                    className={`bg-transparent border text-gray-900 text-lg font-normal rounded-lg block w-full ps-12 p-1.75 dark:bg-transparent 
            dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder={placeholder}
                    onChange={onChange}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TextInput;
