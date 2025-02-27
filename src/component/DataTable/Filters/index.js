

// React
import React from 'react';

//Next

// Constants

// Translation
import { useTranslation } from 'react-i18next';

// Apis

// Helpers

//Redux

//Store

//Action

// Icon

// Layout

// Translations

// Other components
import Button from '@/components/Button';
import Icons from '@/components/Icon/Icons';
import Drawer from '@/components/Drawer';

//Styles
import styles from '@/components/DataTable/Filters/Filters.module.scss';

// Data table Filter component
const Filter = (props) => {
    const {
        isFilterOpen, // A boolean that indicates whether the filter panel/component is currently open or closed.
        setFilterOpen, // A function to toggle or update the state of 'isFilterOpen', controlling the filter's visibility.
        onFilterCancel, // A callback function to be executed when the filter is canceled, likely to reset the filter or close the panel.
        filterComponent, // A React component or JSX element representing the filter UI, which can be rendered inside the popover or elsewhere.
        onFilterSubmit, // A callback function triggered when the filter is applied or submitted, handling filter logic such as updating the data view.
        showFilterCancelBtn,
        showFilterSubmitBtn,
    } = props;

    const { t } = useTranslation('components/datatable/filters');

    return (
        <Drawer isOpen={isFilterOpen} onClose={(isOpen) => {
            onFilterCancel?.();
            setFilterOpen?.(isOpen);
        }}>
            <div className={styles['filter-view-wrapper']}>
                <div className={styles['heading-wrap']}>
                    <div>
                        <div className={styles['heading']}>{t('filtersText')}</div>
                        <div className={styles['description']}>{t('applyFilterText')}</div>
                    </div>

                    <div onClick={() => setFilterOpen?.(false)}>
                        <Icons.XClose />
                    </div>
                </div>
                <div className={styles['content-wrap']}>
                    {filterComponent}
                </div>
                <div className={styles['footer-wrap']}>
                    <div className={styles['btn-wrap']}>
                        {
                            showFilterCancelBtn && <Button
                                className={styles['cancel-btn']}
                                onClick={() => {
                                    onFilterCancel?.();
                                    setFilterOpen?.(false);
                                }}
                            >
                                {t('cancelText')}
                            </Button>
                        }
                        {
                            showFilterSubmitBtn && <Button
                                onClick={() => {
                                    onFilterSubmit?.();
                                    setFilterOpen?.(false);
                                }}
                            >{t('applyText')}</Button>
                        }
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default Filter;
