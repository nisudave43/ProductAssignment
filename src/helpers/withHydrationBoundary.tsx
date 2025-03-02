import React, { ComponentType } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';

interface WithHydrationBoundaryProps {
    dehydratedQueryClient?: unknown;
    [key: string]: unknown;
}

/**
 * A higher-order component that wraps a given component with a HydrationBoundary.
 * This is useful for ensuring that React Query's hydration state is properly managed.
 *
 * @template P - The props type of the component being wrapped.
 * @param {ComponentType<P>} Component - The component to be wrapped with the hydration boundary.
 * @param {keyof WithHydrationBoundaryProps} [propName='dehydratedQueryClient'] - The prop name for the dehydrated query client state.
 *
 * @returns {React.FC<P & WithHydrationBoundaryProps>} - A new component wrapped with a HydrationBoundary.
 */

const withHydrationBoundary = <P extends object>(
    Component: ComponentType<P>,
    propName: keyof WithHydrationBoundaryProps = 'dehydratedQueryClient',
): React.FC<P & WithHydrationBoundaryProps> => {

    /**
     * A component that wraps a given component with a HydrationBoundary.
     *
     * @prop {unknown} [dehydratedQueryClient] - The dehydrated query client state to be used for hydration.
     *
     * @returns The wrapped component with the HydrationBoundary.
     */
    const WithHydrationBoundary: React.FC<P & WithHydrationBoundaryProps> = (props) => {
        const { [propName]: dehydratedQueryClient, ...otherProps } = props;

        return (
            <HydrationBoundary state={dehydratedQueryClient}>
                <Component {...(otherProps as P)} />
            </HydrationBoundary>
        );
    };

    WithHydrationBoundary.displayName = `WithHydrationBoundary(${Component.displayName || Component.name || 'Component'})`;

    return WithHydrationBoundary;
};

export default withHydrationBoundary;
