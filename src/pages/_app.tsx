// React
import React from 'react';

// Next

// Constants

//Store
import store from '@/store/store';

// Helpers

// Contexts

//Redux
import { Provider } from 'react-redux';

// Apis

//Action

// Icon

// Layout

// Other components

// Type
import type { AppProps } from "next/app";

//Styles
import "@/styles/globals.css";


export default function App({ Component, pageProps }: AppProps) {

  const commonProps = {
    ...pageProps,
    ...store?.getState(),
};

  return (
    <Provider store={store}>
      <Component {...commonProps} />
    </Provider>
  );
}
