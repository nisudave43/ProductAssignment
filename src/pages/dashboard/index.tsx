// React
import React from 'react';

// Next
import type { GetServerSideProps } from 'next'

// Constants

//Store

// Helpers
import withHydrationBoundary from '@/helpers/withHydrationBoundary';

// Contexts

//Redux

// Apis
import getAllProducts from '@/apis/products/getAllProducts';

//Action

// Icon
import Add from '@/assets/icons/add';
import ViewEye from '@/assets/icons/viewEye';
// Layout

// Other components
import Breadcrumb from '@/component/BreadCrumb';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import Title from '@/component/Title';
import Datatable from '@/component/Datatable';

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
	const {data: productList} = useQuery(fetchProducts());
	console.log('prodictList',productList)

    const breadCrumbData = [
        {
            'title': 'Products',
            'link': '/Products',
        }
    ];

	const columns = [
		{
			name: 'Name',
			selector: row => row.title,
			sortable: true,
			sortField: 'title',
		},
		{
			name: 'Brand',
			selector: row => row.brand,
			sortable: true,
			sortField: 'brand',
		},
		{
			name: 'Category',
			selector: row => row.category,
			sortable: true,
			sortField: 'category',
		},
		{
			name: 'Current Stock',
			selector: row => row.stock,
			sortable: true,
			sortField: 'stock',
		},
		{
			name: 'Actions',
			selector: row => (
				<button className="text-gray-500 cursor-pointer" onClick={() => console.log('View Product', row)}>
					<ViewEye />
				</button>
			),
		},
	];

	const getTableRows = (data) => {

		if(data && data?.length === 0) {
			return [];
		}
		return data?.map(item => ({
			title: item?.title || '-',
			brand: item?.brand || '-',
			category: item?.category || '-',
			stock: item?.stock || '-',
			rest: item
		}));
	};

	return (
		<div>
			<Breadcrumb data={breadCrumbData} />

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
		</div>
	);
};

export default withHydrationBoundary(DashBoard);