// React
import React from 'react';

// Next
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

// Constants

//Store

// Helpers

// Contexts

//Redux

// Apis

//Action

// Icon

// Layout

// Other components

// Type

//Styles

type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps: GetServerSideProps<{ repo: Repo }> = async () => {
  try {
    // Fetch data from external API
    const res = await fetch('https://api.github.com/repos/vercel/next.js');

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const repo: Repo = await res.json();

    // Pass data to the page via props
    return { props: { repo } };
  } catch (error) {
    console.error('Error fetching repo data:', error);
    return { props: { repo: { name: 'Unknown', stargazers_count: 0 } } };
  }
};

const DashBoard = (props: any) => {
  console.log('props',props)
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashBoard;