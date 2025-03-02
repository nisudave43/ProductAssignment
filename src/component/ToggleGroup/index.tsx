// React
import React, { useState } from 'react';
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

type Option = {
  label: string;
  value: string;
};

type ToggleGroupProps = {
  options: Option[];
  onChange?: (selected: string) => void;
  value?: string
};

/**
 * A toggle group component that renders a group of toggle buttons.
 *
 * @example
 * <ToggleGroup
 *     options={[
 *         { label: 'Option 1', value: 'option1' },
 *         { label: 'Option 2', value: 'option2' },
 *         { label: 'Option 3', value: 'option3' },
 *     ]}
 *     onChange={(selected) => console.log(selected)}
 *     value="option1"
 * />
 *
 * @param {ToggleGroupProps} props - The component props.
 * @param {Option[]} props.options - The options to display as toggle buttons.
 * @param {(selected: string) => void} [props.onChange] - The function to call when a toggle button is selected.
 * @param {string} [props.value] - The value of the selected toggle button, defaults to null.
 *
 * @returns JSX.Element - The rendered toggle group component.
 */
const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, onChange, value }) => {
    const [selected, setSelected] = useState<string | null>(value || null);

    /**
     * Handles the selection of a toggle button.
     *
     * Updates the selected state with the given value and calls the onChange
     * callback with the given value, if provided.
     *
     * @param {string} value - The value of the toggle button selected.
     */
    const handleSelect = (value: string) => {
        setSelected(value);
        onChange?.(value);
    };

    return (
        <div className="inline-flex rounded-md shadow-xs" role="group">
            {options?.map((option, index) => (
                <button
                    key={option.value}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium border border-gray-200 cursor-pointer
            ${index === 0 ? 'rounded-s-lg' : index === options.length - 1 ? 'rounded-e-lg' : ''} 
            ${selected === option.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-200'}`}
                    onClick={() => handleSelect(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default ToggleGroup;
