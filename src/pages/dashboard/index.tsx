// React
import React, { useEffect, useState } from 'react';

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
import getAllProducts from '@/apis/products/getAllProducts';
import deleteProduct from '@/apis/products/deleteProduct';
import getAllProductCategory from '@/apis/products/getAllProductCategory';
import getProductById from '@/apis/products/getProductById';

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

// Type

//Styles

const fetchProducts = (filterObject: { page?: number; limit?: number, search?: string }) => ({
    queryKey: ['productList', filterObject],

    queryFn: async () => {
        // Makes an API call to get the paginated inventory list based on the filter and body
        const response = await getAllProducts(filterObject?.page, filterObject?.limit, filterObject?.search);

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

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();

	const filterObject = {
		page: DEFAULT_FILTER_PAGE,
		limit: DEFAULT_PAGE_SIZE,
		search: '',
	}
	await Promise.allSettled([
		queryClient.prefetchQuery(fetchProducts(filterObject)),
		queryClient.prefetchQuery(fetchProductsCategory()),
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


	const [isDialogShow, setDialogShow] = useState(false);
	const [selectedProductId, setProductId] = useState('');
	const [isProductDialogShow, setProductDialogShow] = useState(false);
	const [editProduct, setEditProduct] = useState({});
	const { showToast, ToastComponent } = useToast();
    const breadCrumbData = [
        {
            'title': 'Products',
            'link': '/Products',
        }
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
			name: 'Category',
			selector: (row: any) => row.category,
			sortable: true,
			sortField: 'category',
		},
		{
			name: 'Price',
			selector: (row: any) => row.price,
			sortable: true,
			sortField: 'price',
		},
		{
			name: 'Actions',
			selector: (row: any) => (
				<div className="flex items-center gap-2">
					<button className="text-gray-500 cursor-pointer" onClick={() => {
						setProductId(row?.id);
						onProductView(row?.id);
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
			setProductDialogShow(true);
			setEditProduct({
				id: response?.id,
				title: response?.title,
				brand: response?.brand,
				category: response?.category,
				price: response?.price
			  });
        },
        onError: () => {
			// setDialogShow(false);
			showToast("Error view product");
        },
    });

    const updateFilter = (fieldName:string, newValue: any) => {

        // Create a copy of the current filters object
        const updatedFilters = { ...filter };
        // Update the specified field with the new value
        updatedFilters[fieldName] = newValue;

        // Update the state with the new filters object
        setFilter(updatedFilters);
    };
	return (
		<div>
			<Breadcrumb data={breadCrumbData} />
			{ToastComponent}
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
				/>
			}
			<Datatable 
				columns={columns}
				data={getTableRows(productList?.products)}
				title={'Products'}
				totalPages={Math.ceil((productList?.total || 0) / (filter?.limit || DEFAULT_PAGE_SIZE))}
				paginationTotalRows={productList?.total}
				rowsPerPage={filter?.limit}
				currentPage={filter?.page}
				onSearchChange={(value) => console.log(value)}
				onPageChange={(page) => {
					updateFilter('page', page);
				}}
				onSearchChange={(value) => {
					updateFilter('page', DEFAULT_FILTER_PAGE);
					updateFilter('search', value);
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
						onProductDelete(selectedProductId);
					}}
					title="Delete Product"
					message="Are you sure you want to delete this product?"
				/>
			}
		</div>
	);
};

export default withHydrationBoundary(DashBoard);