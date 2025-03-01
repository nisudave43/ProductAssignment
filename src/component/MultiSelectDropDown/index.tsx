import React, { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  showLabel: boolean;
  maxVisibleChips: number;
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({
  id,
  label,
  options,
  selectedValues = [],
  showLabel,
  onChange,
  maxVisibleChips = 3,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (!selectedOptions.includes(value)) {
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
    <div className="relative w-full" ref={dropdownRef}>
      {showLabel && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}

      {/* Selected Chips with "+X more" */}
      <div
        className="relative flex flex-wrap gap-1 pl-2 border border-gray-300 rounded-lg cursor-pointer dark:border-gray-600 min-h-[38px] items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        tabIndex={0}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-gray-500 text-sm">{label}</span>
        ) : (
          <>
            {selectedOptions.slice(0, maxVisibleChips).map((option) => (
              <div
                key={option}
                className="flex items-center bg-blue-500 text-white px-2 py-0.5 rounded-full text-sm"
              >
                {options.find((opt) => opt.value === option)?.label}
                <button
                  type="button"
                  className="ml-2 text-white hover:text-gray-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(option);
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            {selectedOptions.length > maxVisibleChips && (
              <div className="relative group">
                <div className="px-2 py-0.5 text-black rounded-full text-sm">
                  +{selectedOptions.length - maxVisibleChips} more
                </div>
                {/* Tooltip showing all selected options */}
                <div className="absolute left-0 top-8 hidden group-hover:block bg-gray-700 text-white text-sm rounded-md p-2 shadow-lg">
                  {selectedOptions.map((option) => (
                    <div key={option}>{options.find((opt) => opt.value === option)?.label}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-600 max-h-48 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div
                key={option.value}
                className={`flex justify-between items-center p-2 cursor-pointer rounded ${
                  selectedOptions.includes(option.value)
                    ? "dark:bg-gray-700 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => !selectedOptions.includes(option.value) && handleSelect(option.value)}
              >
                {option.label}
                {selectedOptions.includes(option.value) && <span className="text-blue-600">✔</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
