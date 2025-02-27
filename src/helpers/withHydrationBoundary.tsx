import React, { ComponentType } from 'react';
import { HydrationBoundary } from '@tanstack/react-query';

interface WithHydrationBoundaryProps {
    dehydratedQueryClient?: unknown;
    [key: string]: unknown;
}

const withHydrationBoundary = <P extends object>(
    Component: ComponentType<P>,
    propName: keyof WithHydrationBoundaryProps = 'dehydratedQueryClient'
): React.FC<P & WithHydrationBoundaryProps> => {
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
