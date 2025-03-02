import React from 'react';

interface DropdownProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
}

/**
 * A dropdown component that is a wrapper around the native select element.
 * @example
 * import { Dropdown } from '@/component/Dropdown';
 *
 * const options = [
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 * ];
 *
 * <Dropdown
 *     id="my-dropdown"
 *     name="my-dropdown"
 *     label="Select an option"
 *     value="1"
 *     onChange={(event) => console.log(event.target.value)}
 *     options={options}
 * />
 *
 * @param {string} id - The HTML id of the dropdown element.
 * @param {string} name - The HTML name of the dropdown element.
 * @param {string} label - The label of the dropdown.
 * @param {string} value - The currently selected value of the dropdown.
 * @param {(event: React.ChangeEvent<HTMLSelectElement>) => void} onChange - The function to call when the value of the dropdown changes.
 * @param {{ value: string; label: string }[]} options - The options of the dropdown.
 * @param {string} [error] - An error message to display below the dropdown.
 * @returns {React.ReactElement} - The rendered dropdown component.
 */
const Dropdown: React.FC<DropdownProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    options,
    error,
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`bg-transparent border text-gray-900 text-lg font-normal rounded-lg block w-full p-2 dark:bg-transparent 
          dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Dropdown;
