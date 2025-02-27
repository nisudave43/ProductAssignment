// React
import React, { useEffect, useState } from 'react';

// Constants
import { DEFAULT_ROUTE } from '@/constants/configuration';

// Next
import Link from 'next/link';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// Icons

// Styles

// Types
interface BreadCrumbItem {
    title: string;
    link: string;
}

interface BreadCrumbProps {
    data: BreadCrumbItem[];
    leftItems?: number;
    rightItems?: number;
    isDotPresent?: boolean;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ data, leftItems = 2, rightItems: initialRightItems = 0, isDotPresent: initialIsDotPresent = false }) => {
    const [rightItems, setRightItems] = useState<number>(initialRightItems);
    const [isDotPresent, setIsDotPresent] = useState<boolean>(initialIsDotPresent);

    console.log('props',data)
    useEffect(() => {
        if (data.length > 5) {
            setIsDotPresent(true);
        }
    }, [data.length]);

    let endIndex: number = isDotPresent ? leftItems + rightItems + 2 : data.length;

    const handleClick = () => {
        setRightItems((prev) => prev + 1);
        if (leftItems + rightItems >= data.length - 2) {
            setIsDotPresent(false);
        }
    };

    return (
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
                <a href={DEFAULT_ROUTE} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                </a>
        </li>
        {
            data?.map((item, index) => {
                const isLast = index === data.length - 1;
                return (
                    <li key={index} aria-current={isLast ? "page" : undefined}>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            {isLast ? (
                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{item?.title}</span>
                            ) : (
                                <a href={item?.link} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{item?.title}</a>
                            )}
                        </div>
                    </li>
                );
            })
        }
        </ol>
    </nav>
    );
};

// Map state
const mapStateToProps = (state: any) => state;

// Map dispatch
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumb);