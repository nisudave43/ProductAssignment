// React
import React, { useState } from 'react';

// Next
import type { GetServerSideProps } from 'next'

// Constants

//Store

// Helpers
import withHydrationBoundary from '@/helpers/withHydrationBoundary';
import useToast from '@/helpers/customHooks/useToast';

// Contexts

//Redux

// Apis
import getAllProducts from '@/apis/products/getAllProducts';
import deleteProduct from '@/apis/products/deleteProduct';

//Action

// Icon
import Add from '@/assets/icons/add';
import ViewEye from '@/assets/icons/viewEye';
import Delete from '@/assets/icons/delete';

// Layout

// Other components
import Breadcrumb from '@/component/BreadCrumb';
import { QueryClient, dehydrate, useQuery, useMutation } from '@tanstack/react-query';
import Title from '@/component/Title';
import Datatable from '@/component/Datatable';
import Dialog from '@/component/Dialog';
import Toast from '@/component/Toast';

// Type

//Styles

const fetchProducts = () => ({
	queryKey : ['productList'],
	queryFn : async () => {
		const response = await getAllProducts();
      	return response;
	},
	refetchInterval : false,
});

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();
	await Promise.allSettled([
		queryClient.prefetchQuery(fetchProducts()),
	]);

	return {
		props:{
			dehydratedQueryClient : dehydrate(queryClient),
		},
	};
};

const DashBoard = (props: any) => {
	const {data: productList, refetch: productListRefetch} = useQuery(fetchProducts());

	const [isDialogShow, setDialogShow] = useState(false);
	const [selectedProductId, setProductId] = useState('');

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
		console.log('data',data)
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
			console.log('response',response)
			showToast("Product deleted successfully");
        },
        onError: () => {
			setDialogShow(false);
			showToast("Error deleting product");
        },
    });

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
						onClick: () => console.log('Adding product'),
						variant: 'primary',
						icon: <Add />
					},
				]}
			/>

			<Datatable 
				columns={columns}
				data={getTableRows(productList?.products)}
				title={'Products'}
				totalPages={30}
				paginationTotalRows={30}
				rowsPerPage={10}
				currentPage={4}
				onSearchChange={(value) => console.log(value)}
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