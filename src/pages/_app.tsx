// React
import React, { useRef } from 'react';

// Next

// Constants
import { DEFAULT_THEME } from '@/constants/configuration';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeProvider';

// Type
import type { AppProps } from "next/app";

//Styles
import '@/styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {

  const commonProps = {
    ...pageProps,
    ...store?.getState(),
};

const {current: queryClient} = useRef(new QueryClient({
  // Initialize a new QueryClient instance with default options
  defaultOptions: {
      queries: {
          // Set the stale time for queries to 60,000 milliseconds (1 minute)
          // This means that queries will be considered fresh for 1 minute before refetching
          staleTime: 60000,
      },
  },
}));

  return (
    <ThemeProvider defaultTheme={DEFAULT_THEME}>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <Component {...commonProps} />
            </Provider>
        </QueryClientProvider>
    </ThemeProvider>
  );
}
