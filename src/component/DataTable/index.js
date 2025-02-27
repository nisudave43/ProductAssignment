

// React
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';

//Next
import dynamic from 'next/dynamic';

// Constants

// Translation
import { useTranslation } from 'react-i18next';

// Apis

// Helpers
import setQueryParameter from '@/helpers/setQueryParameter';

//Redux

//Store

//Action

// Icon

// Layout

// Translations

// Other components
import Button from '@/components/Button';
import * as Popover from '@radix-ui/react-popover';
import Icons from '@/components/Icon/Icons';
import _DataTable from 'react-data-table-component';
import Icon from '@/components/Icon';
import { useDebouncedCallback } from 'use-debounce';
import Breadcrumb from '@/components/BreadCrumb';
import Pagination from '@/components/DataTable/Pagination';

// Dynamic components
const Filters = dynamic(() => import('@/components/DataTable/Filters'), {
    ssr: false,
});
const EmptyState = dynamic(() => import('@/components/EmptyState'));
const TextInput = dynamic(() => import('@/components/Inputs/TextInput'));
const ToggleGroup = dynamic(() => import('@/components/ToggleGroup'));
const Configuration = dynamic(() => import('@/components/DataTable/Configuration'), { ssr: false });
const Loader = dynamic(() => import('@/components/Loader'), { ssr: false });

//Styles
import styles from '@/components/DataTable/DataTable.module.scss';

/**
 * @param {import('react-data-table-component').TableProps<{}>} props
 * @returns
 */

const maxFilterShow = 7;

const CustomPagination = (props) => {

    const { t } = useTranslation('components/datatable');
    const {
        currentPage,
        totalPages,
        onPageChange,
    } = props;
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles['pagination-wrap']}>
            <div className={styles['text']}>
                {`${t('pageText')} ${ !totalPages ? 0 : currentPage} ${t('ofText')} ${!totalPages || isNaN(totalPages) ? 0 : totalPages}`}
            </div>

            <div className={styles['btn-wrapper']}>
                <Button onClick={handlePrev} disabled={currentPage === 1} variant="secondary">
                    {t('previousText')}
                </Button>

                <Button onClick={handleNext} disabled={currentPage === totalPages} variant="secondary">
                    {t('nextText')}
                </Button>
            </div>
        </div>
    );
};

// Function to add a dynamic key-value pair to each object in the array
const addKeyValuePairToColumns = (dataArray = [], keyToAdd, valueToAdd) => {
    if(!keyToAdd) return dataArray; // If no key is provided, return the array unchanged
    return dataArray?.map(item => ({
        ...item,
        [keyToAdd] : item.hasOwnProperty(keyToAdd) ? item[keyToAdd] : valueToAdd, // Keep existing value if key exists
    }));
};

const DataTable = forwardRef((props, ref) => {
    const { t } = useTranslation('components/datatable');

    const {
        heading = '', // The heading text for the component
        description = '', // The description text for the component
        quickFilter = [], // An array of quick filter options, default to an empty array
        quickFilterValue = '', // The current value of the quick filter, default to an empty string
        onQuickFilterChange, // Function to handle changes to the quick filter
        downloadFilesFormat = [], // An array of available file formats for download, default to an empty array
        fileFormatValue = '', // The current selected file format for download, default to an empty string
        onFileFormatChange, // Function to handle changes to the file format
        onPageChange, // Function to handle page change events
        paginationTotalRows, // Total number of rows for pagination
        FilterComponent, // Custom component for filtering
        tableTitle = '', // The title of the table
        filterArray = [], // An array of filters, default to an empty array
        onFilterDelete, // Function to handle the deletion of a filter
        isShowFilters = false, // Boolean flag to show or hide filters, default to false
        showCustomTableHeader = false, // Boolean flag to show or hide a custom table header, default to false
        isSearchShow = true, // Boolean flag to show or hide a search bar, default to true
        progressPending, // Boolean flag indicating if progress is pending
        onSearchChange, // Function to handle changes to the search input
        searchValue = '', // The current value of the search input
        rowsPerPage = 10, // The number of rows to display per page
        onFilterCancel, // Function for on filter cancel callback
        showFilterCancelBtn=true, // Flag to indicate if filter cancel btn show
        onFilterSubmit, // Function for on filter submit callback
        showFilterSubmitBtn = true, // Flag to indicate if filter submit btn show
        isAddBtnShow = false, // Flat to indicate if add btn show
        addBtnText = t('addText'), // Represent add btn text
        onAddBtnClick, // Function for on AddBtn Click
        filterBtnText= t('moreFilterText'), // Represent More filter btn text
        tableActionButtons = [], // [{buttonText, onButtonClick, buttonIcon, buttonVariant, buttonColor, buttonSize}]
        isRowSelectable = false, // Boolean flag indicating whether rows are selectable or not
        isMultipleSelection = false, // Boolean flag indicating whether multiple rows can be selected or not
        isCustomPaginationShow = true, // Boolean flag to indicating whether Custom pagination will show or not
        breadCrumbData = [], // Represent breadCrumbData data
        isConfigurationShow = true, // Boolean flag indicating whether configuration will show or not
        onRowSelect, // Handles the event when a row is selected.
        onRowClicked, // Handles the event when a row is clicked.
        onRowDoubleClicked, // Handles the event when a row is double-clicked.
        resetBtn = {}, // button for reset all filters
        isClientSearch = false, // Flag to indicate if client side search is enabled
        data = [], // Data to be displayed in the table
    } = props;

    /*
        NOTE: pagination doesn't fully work on server side in the library
        so enable it only on the client to avoid hydration error
    */

    const [columns, setColumns] = useState(addKeyValuePairToColumns(props?.columns, 'omit', false));
    const [showPagination, setShowPagination] = useState(false);
    const [isConfigurationPopoverShow, setConfigurationPopover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [searchText, setSearchText] = useState(searchValue);
    const [selectedState, setSelectedState] = useState({});
    const [currentPage, setCurrentPage] = useState(props?.currentPage);
    const totalPages = Math.ceil(paginationTotalRows / rowsPerPage);
    const clickTimer = useRef(null);

    useEffect(() => {
        setColumns(addKeyValuePairToColumns(props?.columns, 'omit', false));
    },[props?.columns?.length]);

    useEffect(() => {
        setShowPagination(props.pagination);
    }, [props.pagination]);

    useEffect(() => {
        setCurrentPage(props?.currentPage);
        setQueryParameter('page',props?.currentPage);
    },[props?.currentPage]);

    useImperativeHandle(ref, () => ({
        getSelectedRow: returnSelectedRow,
    }));

    // Function for handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        if(onPageChange) onPageChange(page);
    };

    const filteredData = useMemo(() => {
        const trimmedSearchText =
        typeof searchText === 'string' ? searchText.trim().toLowerCase() : '';
        if (!isClientSearch || !trimmedSearchText) return data;
        return data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(trimmedSearchText)
            )
        );
    }, [isClientSearch, data, searchText]);

    // Create a debounced callback that calls onSearchChange after 1000 milliseconds
    const debouncedSearchChange = useDebouncedCallback(
        (value) => {
            if (onSearchChange) {
                onSearchChange(value);
            }
        },
        1000
    );

    // Callback function when row selection changes
    const handleRowSelected = (state) => {
        onRowSelect?.(state);
        setSelectedState(state);
    };

    const returnSelectedRow = () => {
        return selectedState;
    };

    const flattenObject = (obj, parentKey = '', result = {}) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let newKey = parentKey ? `${parentKey}.${key}` : key;
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((item, index) => {
                        flattenObject(item, `${newKey}[${index}]`, result);
                    });
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flattenObject(obj[key], newKey, result);
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
        return result;
    };
    const filters = flattenObject(filterArray);
    const filterEntries = Object.entries(filters);
    // Custom no data component
    const NoDataComponent = () => {
        return (
            <EmptyState className={'w-100'} heading={t('noRecordText')}/>
        );
    };

    const handleRowClick = (row) => {
    // Clear the timer if it exists (for double click)
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }

        // Set a timer to differentiate between single and double click
        clickTimer.current = setTimeout(() => {
            if(onRowClicked) onRowClicked(row);
            // Handle single click action here
        }, 250); // 250ms delay to detect double click
    };

    const handleRowDoubleClick = (row) => {
    // Clear the timer set for single click
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
        }

        if(onRowDoubleClicked) onRowDoubleClicked(row);
    // Handle double click action here
    };

    return (
        <div className={styles['data-table-wrapper']}>
            {progressPending &&
                <Loader />
            }
            {
                breadCrumbData?.length > 0 &&
                <div>
                    <Breadcrumb data={breadCrumbData} />
                </div>
            }


            <div className={styles['data-table-wrap']}>
                <div className={styles['information-section']}>
                    <div className={styles['heading-wrapper']}>
                        <div>
                            {
                                heading &&
                                <div className={styles['heading']}>
                                    {heading}
                                </div>
                            }

                            {
                                description &&
                                <div className={styles['description']}>
                                    {description}
                                </div>
                            }
                        </div>

                        <div className={styles['header-btn-wrapper']}>
                            {
                                (isAddBtnShow || tableActionButtons.length > 0) &&
                                <div className={styles['add-btn-wrapper']}>
                                    {
                                        tableActionButtons?.map((btn, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => {btn.onButtonClick?.();}}
                                                variant={btn.buttonVariant || 'primary'}
                                                size={btn.buttonSize || 'md'}
                                            >
                                                {
                                                    btn.buttonIcon && <div>
                                                        <Icon icon={btn.buttonIcon}/>
                                                    </div>
                                                }

                                                <div>{btn.buttonText}</div>
                                            </Button>
                                        ))
                                    }
                                    {isAddBtnShow && <Button onClick={() => { if(onAddBtnClick) onAddBtnClick();}}>
                                        <div>
                                            <Icons.Plus />
                                        </div>
                                        <div>{addBtnText}</div>
                                    </Button>}
                                </div>
                            }
                            {
                                downloadFilesFormat?.length > 0 &&
                                <div className={styles['download-file-wrapper']}>
                                    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                                        <Popover.Trigger asChild>
                                            <Button onClick={() => setIsOpen((prev) => !prev)} variant="secondary">
                                                <div>
                                                    <Icons.DownloadCloud01 />
                                                </div>
                                                <div>
                                                    {t('downloadText')}
                                                </div>
                                            </Button>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            {
                                                downloadFilesFormat?.length > 0 &&
                                                <Popover.Content className={styles['popup-content-wrapper']} side="bottom" align="end" sideOffset={5}>

                                                    {
                                                        downloadFilesFormat?.map((file, index) => {
                                                            return(
                                                                <div
                                                                    key={index}
                                                                    className={`${styles['file']} ${styles[file?.toLowerCase() === fileFormatValue?.toLowerCase() ? 'selected' : '']}`}
                                                                    onClick={() => {
                                                                        if(onFileFormatChange) onFileFormatChange(file);
                                                                        setIsOpen(false);
                                                                    }}
                                                                >
                                                                    {file}
                                                                </div>
                                                            );
                                                        })
                                                    }

                                                </Popover.Content>
                                            }
                                        </Popover.Portal>
                                    </Popover.Root>
                                </div>
                            }
                        </div>
                    </div>

                    {
                        quickFilter?.length > 0 &&
                        <div className={styles['quick-filter-wraps']}>
                            <ToggleGroup
                                data={quickFilter}
                                value={quickFilterValue}
                                onChange={onQuickFilterChange}
                            />
                        </div>
                    }

                    {
                        isShowFilters &&
                        <div className={styles['filter-wrap']}>
                            {
                                filterEntries.length >0  && <div className={styles['applied-filter-wrap']}>
                                    {
                                        filterEntries.slice(0, maxFilterShow).map(([key, value], index) => (
                                            <Button className={styles['filter-btn-wrap']} variant='outlined' key={index}>
                                                <div className={styles.text}>
                                                    {value}
                                                </div>
                                                <div onClick={() => { if (onFilterDelete) onFilterDelete(key); }}>
                                                    <Icons.XClose />
                                                </div>
                                            </Button>
                                        ))
                                    }
                                    {
                                        filterEntries.length > maxFilterShow && (
                                            <Button className={`${styles['more-btn']} ${styles['filter-btn-wrap']}`} onClick={() => setFilterOpen(true)}>
                                            +{filterEntries.length - maxFilterShow} {`${t('moreText')}`}
                                            </Button>
                                        )
                                    }
                                </div>
                            }

                            <Button className={styles['filter-btn-wrap']} variant='outlined' onClick={() => setFilterOpen(true)}>
                                <div>
                                    <Icons.FilterLines />
                                </div>
                                <div className={styles['text']}>
                                    {filterBtnText}
                                </div>
                            </Button>

                            {
                                isFilterOpen &&
                                <Filters
                                    isFilterOpen={isFilterOpen}
                                    setFilterOpen={setFilterOpen}
                                    onFilterCancel={onFilterCancel}
                                    filterComponent={FilterComponent}
                                    onFilterSubmit={onFilterSubmit}
                                    showFilterCancelBtn={showFilterCancelBtn}
                                    showFilterSubmitBtn={showFilterSubmitBtn}
                                />
                            }

                            {
                                Object.entries(resetBtn).length > 0 && filterEntries.length > 0 &&
                                <Button
                                    onClick={() => {resetBtn.onButtonClick?.();}}
                                    variant={resetBtn.buttonVariant || 'primary'}
                                    size={resetBtn.buttonSize || 'md'}
                                    className={styles['reset-btn']}
                                >
                                    {
                                        resetBtn.buttonIcon && <div>
                                            <Icon icon={resetBtn.buttonIcon}/>
                                        </div>
                                    }

                                    <div>{resetBtn.buttonText}</div>
                                </Button>
                            }
                        </div>
                    }

                </div>

                <div className={styles['table-wrapper']}>
                    {
                        showCustomTableHeader &&
                        <div className={styles['heading-wrap']}>
                            <div className={styles['title-wrap']}>
                                <div className={styles['title']}>{tableTitle}</div>
                                <div className={styles['total-record-badge']}>{`${paginationTotalRows ?? 0} ${t('recordText')}`}</div>
                            </div>

                            <div className={styles['search-wrapper']}>
                                {
                                    isSearchShow &&
                                    <div>
                                        <TextInput
                                            placeholder={'Search'}
                                            startIcon={<Icons.SearchMd />}
                                            value={searchText}
                                            onChange={(value) => {
                                                debouncedSearchChange(value);
                                                setSearchText(value);
                                            }}
                                        />
                                    </div>
                                }
                                <div className={styles['table-config-wrap']} onClick={() => { setConfigurationPopover(!isConfigurationPopoverShow);}}>
                                    <Icons.Settings04 />
                                </div>

                                {
                                    isConfigurationShow && isConfigurationPopoverShow &&
                                    <Configuration
                                        columns={columns}
                                        setColumns={setColumns}
                                        isConfigurationPopoverShow={isConfigurationPopoverShow}
                                        onClose={(isOpen) => setConfigurationPopover(isOpen)}
                                    />
                                }
                            </div>
                        </div>
                    }

                    <div className={`${styles['table-wrap']} ${styles[props?.data?.length === 0 ? 'no-record-found' : '']}`}>
                        <_DataTable
                            {...props}
                            data={filteredData}
                            columns={columns}
                            progressPending={undefined}
                            pagination={showPagination}
                            paginationComponent={Pagination}
                            className={`${'table-wrapper'} ${onRowClicked || onRowDoubleClicked ? 'row-cursor' : ''}`}
                            paginationPerPage={10}
                            fixedHeader={true}
                            selectableRows={isRowSelectable}
                            onSelectedRowsChange={handleRowSelected}
                            selectableRowsSingle={!isRowSelectable || !isMultipleSelection}
                            fixedHeaderScrollHeight={'100%'}
                            noDataComponent={<NoDataComponent />}
                            onRowClicked={handleRowClick}
                            onRowDoubleClicked={handleRowDoubleClick}
                        />
                    </div>
                    {
                        isCustomPaginationShow &&
                        <div className={styles['custom-pagination-wrapper']}>
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                paginationTotalRows={paginationTotalRows}
                                rowsPerPage={rowsPerPage}
                            />
                        </div>
                    }
                </div>

                {progressPending &&
                <div className={styles['loading-container']}>
                    <Icons.Loading01 className={styles['loading-icon']} /> <span>Loading...</span>
                </div>
                }
            </div>
        </div>
    );
});

DataTable.displayName = 'DataTable';

export default DataTable;
