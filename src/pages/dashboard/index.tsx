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

// Layout

// Other components
import Breadcrumb from '@/component/BreadCrumb';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import Title from '@/component/Title';

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
	const {data} = useQuery(fetchProducts());


    const breadCrumbData = [
        {
            'title': 'Products',
            'link': '/Products',
        }
    ];

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

			<h1>Dashboard</h1>
		</div>
	);
};

export default withHydrationBoundary(DashBoard);