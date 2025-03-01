import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type ToggleGroupProps = {
  options: Option[];
  onChange?: (selected: string) => void;
  value?: string
};

const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, onChange, value }) => {
  const [selected, setSelected] = useState<string | null>(value || null);

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
            ${index === 0 ? "rounded-s-lg" : index === options.length - 1 ? "rounded-e-lg" : ""} 
            ${selected === option.value ? "bg-gray-900 text-white" : "bg-white text-gray-900 hover:bg-gray-200"}`}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleGroup;
