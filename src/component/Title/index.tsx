// React
import React from 'react';

// Next
import Head from 'next/head';

// Styles

// Define the shape of an action button
interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode; // Icon as a React Node (SVG or Component)
}

// Define the shape of breadcrumb items
interface BreadcrumbItem {
    title: string;
    link?: string;
}

interface TitleProps {
    variant?: 'pageTitle' | 'tableTitle';
    title: string;
    documentTitle?: string;
    description?: string;
    breadCrumbData?: BreadcrumbItem[];
    actionButtons?: ActionButton[];
    defaultActionButtonVariant?: 'primary' | 'secondary';
    isChipsShow?: boolean;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({
    title = '',
    documentTitle = '',
    description = '',
    actionButtons = [],
    defaultActionButtonVariant = 'primary',
    startAdornment,
    endAdornment,
}) => {
    return (
        <div>
            <Head>
                <title>{documentTitle || title}</title>
            </Head>

            {/* Title, Description & Buttons in a Two-line Layout */}
            <div className="w-full flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    {/* Title and Description stacked on two lines */}
                    <div className="flex items-center space-x-2">
                        {startAdornment && <span>{startAdornment}</span>}
                        <h1 className="capitalize text-xl font-medium text-[#101828] leading-[1.875rem]">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-sm font-medium text-[#667085] leading-[1.25rem] mt-1">
                            {description}
                        </p>
                    )}
                </div>

                {/* Action Buttons appear at the end of both lines */}
                {actionButtons.length > 0 && (
                    <div className="flex space-x-2 mt-3 md:mt-0">
                        {actionButtons.map((btn, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={btn.onClick}
                                className={`group flex items-center space-x-2 text-white font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer
                                    ${btn.variant === 'secondary' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-700 hover:bg-blue-800'}
                                    focus:ring-4 focus:ring-blue-300 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
                            >
                                {btn.icon && (
                                    <span className="w-5 h-5 text-white transition-colors group-hover:text-gray-200">
                                        {btn.icon}
                                    </span>
                                )}
                                <span>{btn.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Title;
