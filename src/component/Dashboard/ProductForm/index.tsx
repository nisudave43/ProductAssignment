import React, { useState } from "react";
import TextInput from "@/component/TextInput";
import Search from "@/assets/icons/search";
// const categories = ["Appliances", "Electronics", "Furniture", "Clothing", "Sports"];

type ProductFormProps = {
  categories: string[]; // Categories as an array of strings
  data: any;
  id: string;
  onClose: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ categories, onClose, data, id }) => {
  const [formData, setFormData] = useState(
    id
      ?
      data
        :
      {
        title: "",
        brand: "",
        model: "",
        color: "",
        category: "",
        discount: "",
      }
  );

  // const categories = props?.categories;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.discount) newErrors.discount = "Discount is required";
    else if (isNaN(Number(formData.discount))) newErrors.discount = "Discount must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fields = [
    { name: "title", label: "Title", icon: <Search />},
    { name: "brand", label: "Brand", icon: <Search /> },
    { name: "model", label: "Model", icon: <Search /> },
    { name: "color", label: "Color", icon: <Search /> },
    { name: "discount", label: "Discount", type: "number", icon: <Search /> },
  ]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div
      id="product-modal"
      className="fixed top-0 z-1 left-0 w-full h-full flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm"
    >
       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
      <div className="flex justify-between">
      <h2 className="text-xl font-semibold mb-4">Product Form</h2>
      <button className="cursor-pointer h-8 w-8" onClick={onClose}> X </button>
      </div>

      {fields?.map(({ name, label, type = "text", icon }) => (
        <div key={name} className="mb-4">
          <TextInput
            id={name}
            name={name}
            label={label}
            type={type}
            placeholder={`Enter ${label}`}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            error={errors[name]}
            icon={icon}
          />
        </div>
      ))}

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`bg-transparent border text-gray-900 text-lg font-normal rounded-lg block w-full p-2 dark:bg-transparent 
            dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500
            ${errors.category ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Submit
      </button>
    </form>
    </div>
   
  );
};

export default ProductForm;
