import React, { useState } from 'react';
import TextInput from '@/component/TextInput';
import Search from '@/assets/icons/search';
import Dropdown from '@/component/DropDown';

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

/**
 * ProductForm component is a form used to add or edit product details.
 *
 * @param {Object} props - Component props.
 * @param {string[]} props.categories - Array of category strings for the dropdown.
 * @param {function} props.onClose - Function to close the form.
 * @param {any} props.data - Product data to pre-fill the form when editing.
 * @param {string} props.id - ID of the product being edited, if applicable.
 * @param {function} props.onSuccess - Callback function to invoke on successful form submission.
 * @param {function} props.onAdd - Callback function to invoke when adding a new product.
 * @param {function} props.onEdit - Callback function to invoke when editing an existing product.
 *
 * @returns JSX.Element - The rendered form component.
 */

const ProductForm: React.FC<ProductFormProps> = ({ categories, onClose, data, id, onSuccess, onAdd, onEdit }) => {
    const [formData, setFormData] = useState(
        id
            ?
            data
            :
            {
                title: '',
                brand: '',
                category: '',
                price: '',
                availabilityStatus: '',
            },
    );

    const availabilityOptions = [
        { value: 'Low Stock', label: 'Low Stock' },
        { value: 'Out of Stock', label: 'Out of Stock' },
        { value: 'In Stock', label: 'In Stock' },
    ];
    const { showToast, ToastComponent } = useToast();

    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * Validates the form data.
     *
     * @returns boolean - True if form is valid, false otherwise.
     */
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.price) newErrors.price = 'price is required';
        else if (isNaN(Number(formData.price))) newErrors.price = 'price must be a number';
        if (!formData.availabilityStatus) newErrors.availabilityStatus = 'Availability status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fields = [
        { name: 'title', label: 'Title', icon: <Search />},
        { name: 'brand', label: 'Brand', icon: <Search /> },
        { name: 'price', label: 'Price', type: 'number', icon: <Search /> },
    ];
    /**
     * Handles change event on form inputs.
     *
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event.
     *
     * Updates the formData state with the new value and clears any error for the input.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); // Clear error on input
    };

/**
 * Handles the form submission event.
 *
 * @param {React.FormEvent} e - The form submission event.
 *
 * Prevents the default form submission behavior. Validates the form data,
 * and if valid, performs an edit or add operation based on the presence of an `id`.
 * If `id` is present, calls the `onEdit` function to update an existing product.
 * Otherwise, calls the `onAdd` function to add a new product.
 */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {

            if(id) {

                // onProductEdit({
                //   product: formData,
                //   id: id
                // });
                onEdit(formData);
            } else {
                onAdd(formData);
                // onProductAdd(formData);
            }
        }
    };

    const { mutate: onProductAdd, isPending } = useMutation({
        mutationFn: async (product: any) => {
            return await addProduct(product);
        },

        onSuccess: (response) => {
            showToast('Product Added successfully', () => {
                onSuccess?.();
            });
        },
        onError: (error) => {
            console.error('response',error?.message);
            showToast('Error while adding product');
        },
    });

    const { mutate: onProductEdit } = useMutation({

        mutationFn: async ({ product, id }: { product: any; id: string }) => {
            delete product['id'];
            return editProduct(product, id);
        },
        onSuccess: (response) => {
            showToast('Product Updated successfully', () => {
                onSuccess?.();
            });
        },
        onError: (error) => {
            console.error('response',error?.message);
            showToast('Error while updating product');
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

                {fields?.map(({ name, label, type = 'text', icon }) => (
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
                    options={categories.map(cat => ({ value: cat?.slug || '', label: cat.name || ''}))}
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
