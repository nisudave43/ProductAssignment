// React
import React, { useMemo, useState } from 'react';

// Next
import type { GetServerSideProps } from 'next';

// Constants
import { DEFAULT_PAGE_SIZE, DEFAULT_FILTER_PAGE } from '@/constants/configuration';
// Store

// Helpers
import withHydrationBoundary from '@/helpers/withHydrationBoundary';
import useToast from '@/helpers/customHooks/useToast';
import areArraysEqual from '@/helpers/areArraysEqual';

// Contexts

// Redux

// Apis
import getProductList from '@/apis/products/getProductList';
import deleteProduct from '@/apis/products/deleteProduct';
import getAllProductCategory from '@/apis/products/getAllProductCategory';
import getProductById from '@/apis/products/getProductById';
import getAllProductList from '@/apis/products/getAllProductList';

//Action

// Icon
import Add from '@/assets/icons/add';
import ViewEye from '@/assets/icons/viewEye';
import Delete from '@/assets/icons/delete';

// Layout

// Other components
import Breadcrumb from '@/component/BreadCrumb';
import { QueryClient, dehydrate, useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import Title from '@/component/Title';
import Datatable from '@/component/Datatable';
import Dialog from '@/component/Dialog';
import ProductForm from '@/component/Dashboard/ProductForm';
import PieChart from '@/component/PieChart';
import { Accordion, AccordionItem } from '@/component/Accordion';

// Type

// Styles

/**
 * React query hook to fetch the list of products based on the provided filterObject.
 * The filterObject can contain the following properties:
 * - page: The page number to fetch. Defaults to 1.
 * - limit: The number of products to fetch per page. Defaults to 10.
 * - search: The search query to apply. Defaults to none.
 *
 * @param {Object} filterObject - The filter object to be used in the API call.
 * @returns {Object} - An object containing the queryKey, queryFn, placeholderData, and refetchInterval.
 */
const fetchProducts = (filterObject: { page?: number; limit?: number, search?: string }) => ({
    queryKey: ['productList', filterObject],

    queryFn: async () => {
        const response = await getProductList(filterObject?.page, filterObject?.limit, filterObject?.search || '');
        return response;
    },
    placeholderData: keepPreviousData,
    refetchInterval: false,
});

/**
 * React query hook to fetch the list of product categories.
 *
 * @returns {Object} - An object containing the queryKey, queryFn, placeholderData, and refetchInterval.
 */
const fetchProductsCategory = () => ({
    queryKey : ['productCategory'],
    queryFn : async () => {
        const response = await getAllProductCategory();
      	return response;
    },
    placeholderData: keepPreviousData,
    refetchInterval : false,
});

/**
 * React query hook to fetch the list of all products.
 *
 * @returns {Object} - An object containing the queryKey, queryFn, placeholderData, and refetchInterval.
 */
const fetchAllProducts = () => ({
    queryKey : ['products'],
    queryFn : async () => {
        const response = await getAllProductList();
      	return response;
    },
    placeholderData: keepPreviousData,
    refetchInterval : false,
});

    /**
     * getServerSideProps
     *
     * This function is used to pre-render the dashboard page on the server.
     * It fetches the initial data required for the page to render using react query.
     *
     * @returns {GetServerSidePropsResult} - An object containing the props object with the dehydrated query client and the filter object.
     */
export const getServerSideProps: GetServerSideProps = async () => {
    const queryClient = new QueryClient();

    const filterObject = {
        page: DEFAULT_FILTER_PAGE,
        limit: DEFAULT_PAGE_SIZE,
        search: '',
        category: [],
        sort: {
            'sortField': 'title',
            'sort' : 'asc',
        },
    };
    await Promise.allSettled([
        queryClient.prefetchQuery(fetchProducts(filterObject)),
        queryClient.prefetchQuery(fetchProductsCategory()),
        queryClient.prefetchQuery(fetchAllProducts()),
    ]);

    return {
        props:{
            dehydratedQueryClient : dehydrate(queryClient),
            filterObject,
        },
    };
};


/**
 * Dashboard component to display the product list.
 *
 * This component fetches the initial list of products, product categories and
 * all products from the server and displays them in a table.
 *
 * The component also provides the ability to sort, filter and search the products.
 *
 * The component uses the Datatable component to render the table.
 *
 * The component also provides the ability to add, edit and delete products.
 *
 * The component also provides the ability to view the product details.
 *
 * The component also provides the ability to view the product category breakdown chart.
 *
 * @param {any} props - The component props.
 *
 * @returns {JSX.Element} - The rendered component.
 */
const DashBoard = (props: any) => {

    const {
        filterObject,
    } = props;

    const [filter, setFilter] = useState(filterObject);
    const {data: productList, refetch: productListRefetch} = useQuery(fetchProducts(filter));
    const {data: productCategoryList } = useQuery(fetchProductsCategory());
    const {data: allProductList } = useQuery(fetchAllProducts());
    const [selectedRow, setSelectedRows] = useState([]);
    const [isDialogShow, setDialogShow] = useState(false);
    const [isMultipleDeleteDialogShow, setMultipleDeleteDialogShow] = useState(false);
    const [selectedProductId, setProductId] = useState('');
    const [isProductDialogShow, setProductDialogShow] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [quickFilterValue, setQuickFilterValue] = useState('all');
    const [tempSelectedRow, setTempSelectedRow] = useState([]);

    const breadCrumbData = [
        {
            'title': 'Products',
            'link': '/Products',
        },
    ];

    const [products, setProducts] = useState(allProductList);

    const { showToast, ToastComponent } = useToast();

    // Quick FIlters
    const quickFilters = [
        { label: 'All', value: 'all' },
        { label: 'Low Stock', value: 'low stock' },
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
    ];

    // Columns
    const columns = [
        {
            name: 'Name',
            selector: (row: any) => row.title,
            sortable: true,
            sortField: 'title',
        },
        {
            name: 'Brand',
            selector: (row: any) => row.brand,
            sortable: true,
            sortField: 'brand',
        },
        {
            name: 'Availability Status',
            selector: (row: any) => {
                const statusColors: Record<string, string> = {
                    'low stock': 'bg-yellow-100 text-yellow-600',
                    'out of stock': 'bg-red-100 text-red-600',
                    'in stock': 'bg-green-100 text-green-600',
                };

                const status = row.availabilityStatus?.toLowerCase() || 'unknown';

                return (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            statusColors[status] || 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {row.availabilityStatus}
                    </span>
                );
            },
            sortable: false,
            sortField: 'availabilityStatus',
        },
        {
            name: 'Category',
            selector: (row: any) => row.category,
            sortable: true,
            sortField: 'category',
        },
        {
            name: 'Price',
            selector: (row: any) => row.price,
            sortable: false,
            sortField: 'price',
        },
        {
            name: 'Actions',
            selector: (row: any) => (
                <div className="flex items-center gap-2">
                    <button className="text-gray-500 cursor-pointer" onClick={() => {
                        setProductId(row?.id);
                        // onProductView(row?.id);
                        setEditProductData(row);
                    }}>
                        <ViewEye />
                    </button>
                    <button className="text-red-500 cursor-pointer" onClick={() => {
                        setDialogShow(true);
                        setProductId(row?.id);
                    }}>
                        <Delete />
                    </button>
                </div>

            ),
        },
    ];

    /**
     * Transforms an array of product data into a specific format for table rows.
     *
     * Each product item in the array is mapped to an object with specific fields 
     * such as id, title, brand, availabilityStatus, category, price, and rest.
     * If certain fields are missing in the product item, default values ('-') are used.
     *
     * @param {Array<any>} data - The array of product data to be transformed.
     * @returns {Array<object>} An array of transformed product data objects suitable for table display.
     */
    const getTableRows = (data: Array<any>) => {
        if(data && data?.length === 0) {
            return [];
        }
        return data?.map(item => ({
            id: item?.id,
            title: item?.title || '-',
            brand: item?.brand || '-',
            availabilityStatus: item?.availabilityStatus || '-',
            category: item?.category || '-',
            price: item?.price || '-',
            rest: item,
        }));
    };

    const { mutate: onProductDelete, isPending } = useMutation({
        mutationFn: async (productId: string) => {
            return await deleteProduct(productId);
        },

        onSuccess: (response) => {
            productListRefetch();
            setDialogShow(false);
            showToast('Product deleted successfully');
        },
        onError: () => {
            setDialogShow(false);
            showToast('Error deleting product');
        },
    });

    const { mutate: onProductView } = useMutation({
        mutationFn: async (productId: string) => {
            return await getProductById(productId);
        },

        onSuccess: (response) => {
            setEditProductData(response);
        },
        onError: () => {
            // setDialogShow(false);
            showToast('Error view product');
        },
    });

    /**
     * Set the product data for the edit dialog.
     *
     * @param {Object} data - The product data.
     *
     * @returns {void}
     */
    const setEditProductData = (data: any) => {
        setProductDialogShow(true);
        setEditProduct({
            id: data?.id,
            title: data?.title,
            brand: data?.brand,
            category: data?.category,
            price: data?.price,
            availabilityStatus: data?.availabilityStatus,
		  });
    };
    /**
     * Updates the filter object with a new value for a specified field.
     *
     * Creates a copy of the current filter state, updates the specified field with the new value,
     * and then updates the state with the modified filter object.
     *
     * @param {string} fieldName - The name of the field to update in the filter object.
     * @param {any} newValue - The new value to set for the specified field.
     */

    const updateFilter = (fieldName:string, newValue: any) => {

        // Create a copy of the current filters object
        const updatedFilters = { ...filter };
        // Update the specified field with the new value
        updatedFilters[fieldName] = newValue;

        // Update the state with the new filters object
        setFilter(updatedFilters);
    };

    /**
     * Applies a quick filter to the given products array.
     *
     * Given a string value for the quick filter and an array of products, this function
     * returns a new array containing only the products that match the given quick filter value.
     *
     * If the quick filter value is empty or is the special value 'all', the function returns
     * the original array of products.
     *
     * @param {any[]} products - The array of products to filter.
     * @param {string} quickFilterValue - The value of the quick filter to apply.
     *
     * @returns {any[]} - The filtered array of products.
     */
    const applyQuickFilter = (products: any[], quickFilterValue: string) => {
        if (!quickFilterValue || quickFilterValue === 'all') return products;

        return products.filter(
            (product) => product?.availabilityStatus?.toLowerCase() === quickFilterValue.toLowerCase(),
        );
    };

    /**
     * Applies a search filter to the given products array.
     *
     * Given a search query string and an array of products, this function
     * returns a new array containing only the products whose brand, title, or
     * category contains the given search query string (case-insensitive).
     *
     * If the search query string is empty, the function returns the original
     * array of products.
     *
     * @param {any[]} products - The array of products to filter.
     * @param {string} searchQuery - The search query string to apply.
     *
     * @returns {any[]} - The filtered array of products.
     */
    const applySearchFilter = (products: any[], searchQuery: string) => {
        if (!searchQuery) return products;

        const query = searchQuery.toLowerCase();
        return products.filter(
            (product) =>
                product?.brand?.toLowerCase().includes(query) ||
				product?.title?.toLowerCase().includes(query) ||
				product?.category?.toLowerCase().includes(query),
        );
    };

    /**
     * Paginates the given products array.
     *
     * Given a products array and pagination parameters (page and limit), this function
     * returns a new array containing only the products in the specified page.
     *
     * @param {any[]} products - The array of products to paginate.
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of products per page.
     *
     * @returns {any[]} - The paginated array of products.
     */
    const paginateProducts = (products: any[], page: number, limit: number) => {
        const startIndex = (page - 1) * limit;
        return products.slice(startIndex, startIndex + limit);
    };

    /**
     * Sorts the given products array based on the given sort field and sort order.
     *
     * Given an array of products, a sort field (e.g. 'brand', 'title', etc.), and
     * a sort order ('asc' or 'desc'), this function returns a new array containing
     * the products sorted by the given sort field and order.
     *
     * If the given products array is empty, the function returns an empty array.
     *
     * @param {any[]} data - The array of products to sort.
     * @param {string} sortField - The sort field to sort by.
     * @param {string} sort - The sort order ('asc' or 'desc').
     *
     * @returns {any[]} - The sorted array of products.
     */
	const sortProducts = (data: any, sortField: string, sort: string) => {
        return data?.sort((a:any, b: any) => {
            if (a[sortField] < b[sortField]) return sort === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sort === 'asc' ? 1 : -1;
            return 0;
        });
    };

    /**
     * Computes and memoizes the table rows and total row count based on applied filters, sorting, and pagination.
     *
     * This function:
     * 1. **Handles empty data:** Returns empty rows and zero count if `products` is not available.
     * 2. **Extracts filter parameters**: Gets `search`, `page`, `limit`, `category`, and `sort` from `filter`.
     * 3. **Sorts the products**: Uses `sortProducts()` to order the list based on the provided sort criteria.
     * 4. **Applies filters**:
     *    - **Removes selected rows**: Excludes products that are in `selectedRow`.
     *    - **Applies quick filter**: Uses `applyQuickFilter()` to filter matching products.
     *    - **Applies search filter**: Uses `applySearchFilter()` to filter products based on `search`.
     *    - **Filters by category**: Keeps only products matching the selected category (if any).
     * 5. **Paginates the results**: Uses `paginateProducts()` to get only the required rows for the current page.
     * 6. **Formats table rows**: Converts paginated products into table rows using `getTableRows()`.
     *
     * Dependencies:
     * - Memoized using `useMemo` to optimize performance and avoid unnecessary recalculations.
     * - Recomputed when `filter`, `products.products`, `selectedRow`, or `quickFilterValue` change.
     *
     * @returns {Object} An object containing:
     *   - `tableRows`: The processed and paginated table rows.
     *   - `totalRows`: The total number of filtered products.
    */
    const { tableRows, totalRows } = useMemo(() => {
        if (!products?.products?.length) return { tableRows: [], totalRows: 0 };

        const { search, page = 1, limit = 10, category, sort } = filter || {};
        const sortedProducts = sortProducts(products.products, sort?.sortField, sort?.sort);

        const filteredProducts = sortedProducts.filter((product: any) => 
            !selectedRow.includes(product?.id) &&
            applyQuickFilter([product], quickFilterValue).length &&
            applySearchFilter([product], search).length &&
            (!category?.length || category.includes(product.category))
        );

        return {
            tableRows: getTableRows(paginateProducts(filteredProducts, page, limit)),
            totalRows: filteredProducts.length,
        };
    }, [filter, products?.products, selectedRow, quickFilterValue]);

    /**
     * Computes and memoizes the count of products in each category.
     *
     * This function:
     * 1. **Handles missing data safely**: Returns an empty object if `products.products` is undefined.
     * 2. **Uses `reduce` to aggregate category counts**:
     *    - Iterates over all products.
     *    - Increments the count for each product's category.
     *    - If a category is encountered for the first time, initializes its count to 1.
     * 3. **Uses `useMemo` for optimization**:
     *    - The computation is memoized to avoid unnecessary recalculations.
     *    - Recomputes only when `products` changes.
     *
     * @returns {Record<string, number>} An object where keys are category names and values are the respective product counts.
    */
    const categoryCount = useMemo(() => {
        if (!products?.products) return {}; // Ensure safety

        return products.products.reduce<Record<string, number>>((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
    }, [products]);

    /**
     * Adds a new product to the list and updates the component state.
     * Also:
     * 1. **Closes the product form dialog**: By setting `productDialogShow` to false.
     * 2. **Displays a success toast**: Using `showToast`.
     * 3. **Resets the search filter**: By setting `search` to an empty string.
     *
     * @param {object} product - The product data to be added.
     * @returns {void}
     */
	  const onProductAdd = (product: any) => {
        if (!product) {
            console.error('Invalid product data');
            return;
        }

        setProducts((prevState: any) => {
            const existingProducts = prevState?.products || [];

            // Generate new id based on the length of the existing product list
            const newProduct = {
                ...product,
                id: existingProducts.length + 1,
            };

            return {
                ...prevState,
                products: [...existingProducts, newProduct],
            };
        });

        showToast('Product Added Successfully');
        setProductDialogShow(false);
        updateFilter('search', '');
        setEditProduct({});
    };


    /**
     * Deletes a product from the list and updates the component state.
     * Also:
     * 1. **Closes the delete confirmation dialog**: By setting `dialogShow` to false.
     * 2. **Displays a success toast**: Using `showToast`.
     * 3. **Resets the search filter**: By setting `search` to an empty string.
     *
     * @param {string} productId - The ID of the product to be deleted.
     * @returns {void}
     */
    const onDeleteProduct = (productId: string) => {
        if (!productId) {
            console.error('Invalid product ID');
            return;
        }

        setProducts((prevState: any) => {
            const existingProducts = [...(prevState?.products || [])];

            // Filter out the product to be deleted
            const updatedProducts = existingProducts.filter(product => product.id !== productId);

            // If no change, return previous state
            if (existingProducts.length === updatedProducts.length) return prevState;

            return {
                ...prevState,
                products: updatedProducts,
            };
        });

        showToast('Product Deleted Successfully');
        setDialogShow(false);
        updateFilter('search', '');
    };

    /**
     * Updates an existing product in the list with new data.
     *
     * This function:
     * 1. **Validates input:** Ensures `updatedProduct` and its `id` are provided.
     * 2. **Updates the product list:** Maps over existing products, replacing the product with the matching `id` 
     *    with `updatedProduct`.
     * 3. **Updates component state:** Sets the updated products list in the component state.
     * 4. **Displays success notification:** Shows a toast message indicating successful update.
     * 5. **Closes the product form dialog:** Sets `productDialogShow` to false.
     * 6. **Resets search filter:** Clears the search filter by setting it to an empty string.
     *
     * @param {object} updatedProduct - The product data containing the updated details and must include an `id`.
     */
    const onProductEdit = (updatedProduct: any) => {
        if (!updatedProduct || !updatedProduct.id) {
            console.error('Invalid product data');
            return;
        }

        setProducts((prevState: any) => {
            const existingProducts = prevState?.products || [];

            const updatedProducts = existingProducts.map((product: any) =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product,
            );

            return {
                ...prevState,
                products: updatedProducts,
            };
        });

        showToast('Product Updated Successfully');
        setProductDialogShow(false);
        updateFilter('search', '');
        setEditProduct({});
    };

    /**
     * Converts an array of objects into an array of dropdown options.
     *
     * This function assumes that each object in the array has a `slug` and a `name` property.
     * It maps over the array and returns a new array of objects with `value` and `label` properties.
     * The `value` property is set to the `slug` of the original object, and the `label` property
     * is set to the `name` of the original object.
     *
     * @param {object[]} data - An array of objects with `slug` and `name` properties.
     * @returns {object[]} An array of objects with `value` and `label` properties.
     */
    function convertToDropdownOptions(data :any) {
        return data.map((item: any) => ({
		  value: item.slug,
		  label: item.name,
        }));
	}

    return (
        <div>
            <div className='pt-3 pb-3'>
                <Breadcrumb data={breadCrumbData} />
            </div>
            {ToastComponent}
            <div className='pt-4 pb-4'>
                <Title
                    title={'Products'}
                    documentTitle={'Products'}
                    description={'View Product List'}
                    actionButtons={[
                        {
                            label: 'Add Product',
                            onClick: () => setProductDialogShow(true),
                            variant: 'primary',
                            icon: <Add />,
                        },
                    ]}
                />
            </div>

            <div className='mb-6'>
                <Accordion>
                    <AccordionItem id="accordion-item-1" title="Category-based Product Breakdown Chart">
                        <div className='h-150 flex align-items-center justify-center'>
                            <PieChart data={categoryCount}/>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            {
                isProductDialogShow &&
				<ProductForm
				    categories={productCategoryList || []}
				    data={editProduct}
				    id={editProduct?.id || ''}
				    onClose={() => {
				        setProductDialogShow(false);
				        setEditProduct({});
				    }}
				    onSuccess={() => {
				        productListRefetch();
				        setProductDialogShow(false);
				        setEditProduct({});
				    }}
				    onAdd={(product) => onProductAdd(product)}
				    onEdit={(product) => onProductEdit(product)}
				/>
            }
            <Datatable
                columns={columns}
                data={tableRows}
                title={'Products'}
                totalPages={Math.ceil((totalRows || 0) / (filter?.limit || DEFAULT_PAGE_SIZE))}
                paginationTotalRows={totalRows}
                rowsPerPage={filter?.limit}
                currentPage={filter?.page}
                onPageChange={(page) => {
                    updateFilter('page', page);
                }}
                onSearchChange={(value) => {
                    updateFilter('page', DEFAULT_FILTER_PAGE);
                    updateFilter('search', value);
                }}
                onMultipleRowDelete={(rows) => {
                    setTempSelectedRow(rows);
                    if(rows?.length > 0 && !areArraysEqual(tempSelectedRow, rows)) setMultipleDeleteDialogShow(true);
                }}
                quickFilters={quickFilters || []}
                onQuickFilterChange={(value) => {
                    updateFilter('page', DEFAULT_FILTER_PAGE);
                    setQuickFilterValue(value);
                }}
                selectedQuickFilter={quickFilterValue}
                multiSelectFilterOptions={convertToDropdownOptions(productCategoryList || [])}
                onMultiSelectChange = {(value) => {
                    updateFilter('category', value);
                }}
                multiSelectValue={filter?.category}
                multiSelectLabel='Category'
                onSortingChange={(value) => {
                    updateFilter('sort', value);
                }}
            />
            {
                isDialogShow &&
				<Dialog
				    onClose={() => {
				        setProductId('');
				        setDialogShow(false);
				    }}
				    onConfirm={() => {
				        onDeleteProduct(selectedProductId);
				        // onProductDelete(selectedProductId);
				    }}
				    title="Delete Product"
				    message="Are you sure you want to delete this product?"
				/>
            }

            {
                isMultipleDeleteDialogShow &&
				<Dialog
				    onClose={() => {
				        setMultipleDeleteDialogShow(false);
				    }}
				    onConfirm={() => {
				        setSelectedRows(tempSelectedRow);
                        setMultipleDeleteDialogShow(false);
				    }}
				    title="Delete Product"
				    message="Are you sure you want to delete these products?"
				/>
            }
        </div>
    );
};

export default withHydrationBoundary(DashBoard);
