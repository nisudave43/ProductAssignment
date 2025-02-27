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
import Home from '@/assets/icons/home';
import Slash from '@/assets/icons/slash';

// Styles
import styles from '@/component/BreadCrumb/BreadCrumb.module.scss';

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
        <nav aria-label="breadcrumb">
            <ol className={styles['bread-crumb-wrapper']}>
                <li className={styles['breadcrumb-item']}>
                    <Link href={DEFAULT_ROUTE}>
                        <Home />
                    </Link>
                </li>
                {data.length > 0 &&
                    data.slice(0, endIndex).map((breadCrumb, index) => (
                        <li key={index} className={`text-sm medium ${styles['breadcrumb-item']}`}>
                            <Slash />
                            {(isDotPresent && index === rightItems + leftItems + 1) || index === data.length - 1 ? (
                                <span className={styles['text-sm semi-bold']}>{data.at(-1)?.title}</span>
                            ) : index === leftItems && isDotPresent ? (
                                <span className={styles['text-sm medium dots']} onClick={handleClick}>
                                    ...
                                </span>
                            ) : (
                                <Link className='text-sm medium' href={breadCrumb.link}>
                                    {breadCrumb.title}
                                </Link>
                            )}
                        </li>
                    ))}
            </ol>
        </nav>
    );
};

// Map state
const mapStateToProps = (state: any) => state;

// Map dispatch
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumb);