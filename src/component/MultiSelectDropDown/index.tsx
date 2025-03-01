import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  id,
  name,
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value && !selectedOptions.includes(value)) {
      const updatedOptions = [...selectedOptions, value];
      setSelectedOptions(updatedOptions);
      onChange(updatedOptions);
    }
  };

  const removeChip = (value: string) => {
    const updatedOptions = selectedOptions.filter((option) => option !== value);
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select
        id={id}
        name={name}
        onChange={handleSelect}
        className="bg-transparent border text-gray-900 text-lg font-normal rounded-lg block w-full p-2 dark:bg-transparent 
          dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <div
            key={option}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
          >
            {options.find((opt) => opt.value === option)?.label}
            <button
              type="button"
              className="ml-2 text-white hover:text-gray-200"
              onClick={() => removeChip(option)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
