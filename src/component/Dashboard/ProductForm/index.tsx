import React, { useState } from "react";
import TextInput from "@/component/TextInput";
import Search from "@/assets/icons/search";
import Dropdown from "@/component/DropDown";

import addProduct from '@/apis/products/addProduct';
import editProduct from '@/apis/products/editProduct';
import { useMutation } from '@tanstack/react-query';

import useToast from '@/helpers/customHooks/useToast';

type ProductFormProps = {
  categories: string[]; // Categories as an array of strings
  data: any;
  id: string;
  onClose: () => void;
  onSuccess: () => void,
  onAdd: (product: any) => void,
  onEdit: (product: any) => void
};

const ProductForm: React.FC<ProductFormProps> = ({ categories, onClose, data, id, onSuccess, onAdd, onEdit }) => {
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
        availabilityStatus: ""
      }
  );

  const availabilityOptions = [
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "In Stock", label: "In Stock" },
  ];
  const { showToast, ToastComponent } = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "price is required";
    else if (isNaN(Number(formData.price))) newErrors.price = "price must be a number";
    if (!formData.availabilityStatus) newErrors.availabilityStatus = "Availability status is required";

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

          // onProductEdit({
          //   product: formData,
          //   id: id
          // });
          onEdit(formData)
        } else {
          onAdd(formData)
          // onProductAdd(formData);
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

      <Dropdown
        id="availabilityStatus"
        name="availabilityStatus"
        label="Availability Status"
        value={formData.availabilityStatus}
        onChange={handleChange}
        options={availabilityOptions}
        error={errors.availabilityStatus}
      />

      <Dropdown
        id="category"
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        options={categories.map(cat => ({ value: cat.slug, label: cat.name }))} 
        error={errors.category}
      />

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
