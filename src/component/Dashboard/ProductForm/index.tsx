import React, { useState } from "react";
import TextInput from "@/component/TextInput";
import Search from "@/assets/icons/search";


import addProduct from '@/apis/products/addProduct';
import editProduct from '@/apis/products/editProduct';
import { useMutation } from '@tanstack/react-query';

import useToast from '@/helpers/customHooks/useToast';

type ProductFormProps = {
  categories: string[]; // Categories as an array of strings
  data: any;
  id: string;
  onClose: () => void;
  onSuccess: () => void
};

const ProductForm: React.FC<ProductFormProps> = ({ categories, onClose, data, id, onSuccess }) => {
  const [formData, setFormData] = useState(
    id
      ?
      data
        :
      {
        title: "",
        brand: "",
        category: "",
        price: "",
      }
  );

  const { showToast, ToastComponent } = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "price is required";
    else if (isNaN(Number(formData.price))) newErrors.price = "price must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fields = [
    { name: "title", label: "Title", icon: <Search />},
    { name: "brand", label: "Brand", icon: <Search /> },
    { name: "price", label: "Price", type: "number", icon: <Search /> },
  ]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {

        if(id) {
          console.log('here',formData)
          onProductEdit({
            product: formData,
            id: id
          });
        } else {
          onProductAdd(formData);
        }
    }
  };

  const { mutate: onProductAdd, isPending } = useMutation({
    mutationFn: async (product: any) => {
        return await addProduct(product);
    },

    onSuccess: (response) => {
        showToast("Product Added successfully", () => {
            onSuccess?.()
        });
    },
    onError: (error) => {
        console.error("response",error?.message);
        showToast("Error while adding product");
    },
});

const { mutate: onProductEdit } = useMutation({

  mutationFn: async ({ product, id }: { product: any; id: string }) => {
      delete product['id'];
      return editProduct(product, id);
    },
    onSuccess: (response) => {
        showToast("Product Updated successfully", () => {
          onSuccess?.()
        });
    },
    onError: (error) => {
        console.error("response",error?.message);
        showToast("Error while updating product");
    },
});

  return (
    <div
      id="product-modal"
      className="fixed top-0 z-1 left-0 w-full h-full flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm"
    >
      {ToastComponent}
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
          {categories?.map((cat) => (
            <option key={cat} value={cat?.slug}>
              {cat?.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Submit
      </button>
    </form>
    </div>
   
  );
};

export default ProductForm;
