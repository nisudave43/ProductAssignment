// React
import React, { useMemo, useState } from 'react';

// Next
import type { GetServerSideProps } from 'next'

// Constants
import { DEFAULT_PAGE_SIZE, DEFAULT_FILTER_PAGE } from '@/constants/configuration';
//Store

// Helpers
import withHydrationBoundary from '@/helpers/withHydrationBoundary';
import useToast from '@/helpers/customHooks/useToast';

// Contexts

//Redux

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

//Styles

const fetchProducts = (filterObject: { page?: number; limit?: number, search?: string }) => ({
    queryKey: ['productList', filterObject],

    queryFn: async () => {
        // Makes an API call to get the paginated inventory list based on the filter and body
        const response = await getProductList(filterObject?.page, filterObject?.limit, filterObject?.search || '');

        // Returns the 'data' field from the response object
        return response;
    },
	placeholderData: keepPreviousData,
    // Disables automatic refetching of data at a set interval
    refetchInterval: false,
});

const fetchProductsCategory = () => ({
	queryKey : ['productCategory'],
	queryFn : async () => {
		const response = await getAllProductCategory();
      	return response;
	},
	placeholderData: keepPreviousData,
	refetchInterval : false,
});

const fetchAllProducts = () => ({
	queryKey : ['products'],
	queryFn : async () => {
		const response = await getAllProductList();
      	return response;
	},
	placeholderData: keepPreviousData,
	refetchInterval : false,
});

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();

	const filterObject = {
		page: DEFAULT_FILTER_PAGE,
		limit: DEFAULT_PAGE_SIZE,
		search: '',
		category: [],
		sort: {
			'sortField': 'title',
			'sort' : 'asc'
		}
	}
	await Promise.allSettled([
		queryClient.prefetchQuery(fetchProducts(filterObject)),
		queryClient.prefetchQuery(fetchProductsCategory()),
		queryClient.prefetchQuery(fetchAllProducts()),
	]);

	return {
		props:{
			dehydratedQueryClient : dehydrate(queryClient),
			filterObject
		},
	};
};


const DashBoard = (props: any) => {

	const {
		filterObject
	} = props;

	const [filter, setFilter] = useState(filterObject);
	const {data: productList, refetch: productListRefetch} = useQuery(fetchProducts(filter));
	const {data: productCategoryList, } = useQuery(fetchProductsCategory());
	const {data: allProductList, } = useQuery(fetchAllProducts());
	const [selectedRow, setSelectedRows] = useState([]);
	const [isDialogShow, setDialogShow] = useState(false);
	const [selectedProductId, setProductId] = useState('');
	const [isProductDialogShow, setProductDialogShow] = useState(false);
	const [editProduct, setEditProduct] = useState({});
	const { showToast, ToastComponent } = useToast();
	const [quickFilterValue, setQuickFilterValue] = useState('all');
    const breadCrumbData = [
        {
            'title': 'Products',
            'link': '/Products',
        }
    ];

	const [products, setProducts] = useState(allProductList);

	const quickFilters = [
		{ label: "All", value: "all" },
		{ label: "Low Stock", value: "low stock" },
		{ label: "Out of Stock", value: "out of stock" },
		{ label: "In Stock", value: "in stock" }
	];


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
						setEditProductData(row)
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
			rest: item
		}));
	};

    const { mutate: onProductDelete, isPending } = useMutation({
        mutationFn: async (productId: string) => {
            return await deleteProduct(productId);
        },

        onSuccess: (response) => {
			productListRefetch();
			setDialogShow(false);
			showToast("Product deleted successfully");
        },
        onError: () => {
			setDialogShow(false);
			showToast("Error deleting product");
        },
    });

	const { mutate: onProductView } = useMutation({
        mutationFn: async (productId: string) => {
            return await getProductById(productId);
        },

        onSuccess: (response) => {
			setEditProductData(response)
        },
        onError: () => {
			// setDialogShow(false);
			showToast("Error view product");
        },
    });

	const setEditProductData = (data: any) => {
		setProductDialogShow(true);
		setEditProduct({
			id: data?.id,
			title: data?.title,
			brand: data?.brand,
			category: data?.category,
			price: data?.price,
			availabilityStatus: data?.availabilityStatus
		  });
	}
    const updateFilter = (fieldName:string, newValue: any) => {

        // Create a copy of the current filters object
        const updatedFilters = { ...filter };
        // Update the specified field with the new value
        updatedFilters[fieldName] = newValue;

        // Update the state with the new filters object
        setFilter(updatedFilters);
    };

	// Function to filter out selected rows
	const excludeSelectedProducts = (products: any[], selectedRow: any[]) => {
		return products.filter((product) => !selectedRow.includes(product.id));
	};

	// Function to filter products based on quickFilterValue
	const applyQuickFilter = (products: any[], quickFilterValue: string) => {
		if (!quickFilterValue || quickFilterValue === "all") return products;

		return products.filter(
			(product) => product?.availabilityStatus?.toLowerCase() === quickFilterValue.toLowerCase()
		);
	};

	// Function to apply search filter
	const applySearchFilter = (products: any[], searchQuery: string) => {
		if (!searchQuery) return products;

		const query = searchQuery.toLowerCase();
		return products.filter(
			(product) =>
				product?.brand?.toLowerCase().includes(query) ||
				product?.title?.toLowerCase().includes(query) ||
				product?.category?.toLowerCase().includes(query)
		);
	};
	// Function to handle pagination
	const paginateProducts = (products: any[], page: number, limit: number) => {
		const startIndex = (page - 1) * limit;
		return products.slice(startIndex, startIndex + limit);
	};

	const filterProductsByCategory = (products: any, category: any) => {
		if (category.length > 0) {
			return products.filter((product:any) => category.indexOf(product.category) !== -1);
		}
		return products; // Return all products if no category filter is applied
	  };


	  const sortProducts = (data: any, sortField: string, sort: string) => {
		return data?.sort((a:any, b: any) => {
			if (a[sortField] < b[sortField]) return sort === 'asc' ? -1 : 1;
			if (a[sortField] > b[sortField]) return sort === 'asc' ? 1 : -1;
			return 0;
		});
	}
	
	  const { tableRows, totalRows } = useMemo(() => {
		// Ensure products exist
		if (!products?.products?.length) return { tableRows: [], totalRows: 0 };
	
		// Extract filter values safely
		const { search, page = 1, limit = 10, category, sort } = filter || {};
	
		 // Sort function
		 const sortedProducts = sortProducts(products.products, sort?.sortField, sort?.sort) 

		// Apply all filtering functions in a single pass
		const filteredProducts = sortedProducts
			.filter(product => !selectedRow.includes(product)) // Exclude selected products
			.filter(product => applyQuickFilter([product], quickFilterValue).length) // Quick filter
			.filter(product => applySearchFilter([product], search).length) // Search filter
			.filter(product => !Array.isArray(category) || category.length === 0 || category.includes(product.category)); // Category filter
	
		// Apply pagination
		const paginatedProducts = paginateProducts(filteredProducts, page, limit);
	
		return { 
			tableRows: getTableRows(paginatedProducts), 
			totalRows: filteredProducts.length 
		};
	}, [filter?.search, filter?.sort, filter?.page, filter?.limit, filter?.category?.length, products?.products, selectedRow, quickFilterValue]);
	


	const categoryCount = useMemo(() => {
		return products?.products?.reduce((acc, product) => {
		  acc[product.category] = (acc[product.category] || 0) + 1;
		  return acc;
		}, {});
	  }, [products]);
	
	  const onProductAdd = (product: any) => {
		if (!product) {
			console.error("Invalid product data");
			return;
		}
	
		setProducts((prevState) => {
			const existingProducts = prevState?.products || [];
	
			// Generate new id based on the length of the existing product list
			const newProduct = {
				...product,
				id: existingProducts.length + 1,
			};
	
			return {
				...prevState,
				products: [...existingProducts, newProduct], // Add new product with new id
			};
		});

		showToast("Product Added Successfully");
		setProductDialogShow(false);
		updateFilter('search', '');
	};
	
	const onDeleteProduct = (productId: string) => {
		if (!productId) {
			console.error("Invalid product ID");
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
	
		showToast("Product Deleted Successfully");
		setDialogShow(false);
		updateFilter("search", "");
	};
	
	const onProductEdit = (updatedProduct: any) => {
		if (!updatedProduct || !updatedProduct.id) {
			console.error("Invalid product data");
			return;
		}
	
		setProducts((prevState: any) => {
			const existingProducts = prevState?.products || [];
	
			const updatedProducts = existingProducts.map((product: any) =>
				product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
			);
	
			return {
				...prevState,
				products: updatedProducts,
			};
		});

		showToast("Product Updated Successfully");
		setProductDialogShow(false);
		updateFilter('search', '');
	};
	
	function convertToDropdownOptions(data :any) {
		return data.map((item: any) => ({
		  value: item.slug,
		  label: item.name
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
							icon: <Add />
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
					id={editProduct?.id}
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
				onRowSelect={(rows) => {
				}}
				onMultipleRowDelete={(rows) => {
					setSelectedRows(rows);
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
		</div>
	);
};

export default withHydrationBoundary(DashBoard);