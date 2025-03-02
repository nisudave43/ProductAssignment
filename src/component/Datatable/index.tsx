// React
import React, { useMemo, useState } from 'react';

// Constants

// Next

// Redux

// Icons
import Search from '@/assets/icons/search';
import Delete from '@/assets/icons/delete';

// Helpers
import truncateString from '@/helpers/truncateString';
// Styles

// Types

// Other components
import TextInput from '@/component/TextInput';
import { useDebouncedCallback } from 'use-debounce';
import ToggleGroup from '@/component/ToggleGroup';
import MultiSelectDropdown from '@/component/MultiSelectDropDown';

// Map state

interface Column {
    name: string;
    selector: (row: any) => any;
    sortable?: boolean;
    sortField?: string;
}

interface DatatableProps {
    columns: Column[];
    data: any[],
    title: string,
    isSearchShow?: boolean,
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    paginationTotalRows: number;
    rowsPerPage: number;
    onSearchChange: (value: string) => void;
    onRowSelect: (selectedRows: string[]) => void,
    selectedRow: string[],
    onMultipleDelete: (selectedRows: string[]) => void,
    quickFilters: { label: string; value: string }[];
    onQuickFilterChange: (value: string) => void,
    selectedQuickFilter: string,
    multiSelectFilterOptions: { label: string; value: string }[],
    multiSelectValue: string[],
    onMultiSelectChange: (value: string[]) => void,
    multiSelectLabel: string,
    onMultipleRowDelete: (selectedRows: string[]) => void,
    onSortingChange: ({ sortField, sort }: { sortField: string; sort: string }) => void
}

/**
 * Add a sort key to a column if it is sortable.
 * @param {Object[]} columns An array of column objects.
 * @return {Object[]} The columns with sort key added to sortable columns.
 */
const addSortKey = (columns: any) =>{
    return columns.map((column: any) =>
        column.sortable ? { ...column, sort: 'asc' } : column,
    );
};

/**
 * Datatable component is a versatile, reusable table that supports features like
 * pagination, sorting, searching, quick filters, multi-select filters, and bulk delete.
 * 
 * Props:
 * - `data`: Array of row data objects to be displayed in the table.
 * - `title`: String title for the table.
 * - `isSearchShow`: Boolean to show/hide the search input.
 * - `currentPage`: Current page number for pagination.
 * - `totalPages`: Total number of pages available.
 * - `onPageChange`: Callback function to handle page changes.
 * - `onSearchChange`: Callback function triggered on search input change.
 * - `paginationTotalRows`: Total number of rows available for pagination.
 * - `rowsPerPage`: Number of rows to display per page.
 * - `onRowSelect`: Callback function called with selected row IDs.
 * - `selectedRow`: Array of initially selected row IDs.
 * - `onMultipleRowDelete`: Callback function for bulk row deletion.
 * - `quickFilters`: Array of quick filter options with labels and values.
 * - `onQuickFilterChange`: Callback function for quick filter changes.
 * - `selectedQuickFilter`: Currently selected quick filter value.
 * - `multiSelectFilterOptions`: Array of multi-select filter options.
 * - `onMultiSelectChange`: Callback function for changes in multi-select filter.
 * - `multiSelectValue`: Array of selected values in multi-select filter.
 * - `multiSelectLabel`: Label for the multi-select filter dropdown.
 * - `onSortingChange`: Callback function triggered on sorting change, with sort field and direction.
 */

const Datatable: React.FC<DatatableProps> = ({
    data,
    title,
    isSearchShow = true,
    currentPage,
    totalPages,
    onPageChange,
    onSearchChange,
    paginationTotalRows,
    rowsPerPage,
    onRowSelect,
    selectedRow,
    onMultipleRowDelete,
    quickFilters,
    onQuickFilterChange,
    selectedQuickFilter,
    multiSelectFilterOptions,
    onMultiSelectChange,
    multiSelectValue,
    multiSelectLabel,
    onSortingChange,
    ...props
}) => {

    const [selectedRows, setSelectedRows] = useState(selectedRow?.length ? selectedRow : []);
    const [selectAll, setSelectAll] = useState(false);
    const [columns, setColumns] = useState(addSortKey(props?.columns));

    /**
     * Toggles selection of all rows in the table.
     * 
     * When all rows are already selected, deselects all rows and calls the
     * `onRowSelect` callback with an empty array.
     * 
     * When no rows are selected, selects all rows and calls the `onRowSelect`
     * callback with an array of the selected row data.
     */
    const handleSelectAll = (): void => {
        if (selectAll) {
            setSelectedRows([]);
            onRowSelect?.([]); // Callback with empty array when deselecting all
        } else {
            const selectedData = data.map((row) => row);
            setSelectedRows(selectedData.map((row) => row.id));
            onRowSelect?.(selectedData); // Callback with selected row data
        }
        setSelectAll(!selectAll);
    };
    /**
     * Toggles selection of a row in the table.
     * 
     * When a row is already selected, deselects the row and removes it from the
     * `selectedRows` state array.
     * 
     * When a row is not already selected, selects the row and adds it to the
     * `selectedRows` state array.
     * 
     * Calls the `onRowSelect` callback with an array of selected row data.
     * @param id The ID of the row to toggle selection of.
     */
    const handleRowSelect = (id: string | number): void => {
        setSelectedRows((prevSelected: any) => {
            const newSelected = prevSelected.includes(id)
                ? prevSelected.filter((rowId : string) => rowId !== id)
                : [...prevSelected, id];
            const selectedData = data.filter((row) => newSelected.includes(row.id));
            onRowSelect?.(selectedData); // Callback with selected row data
            return newSelected;
        });
    };

    /**
     * Debounced search handler that delays the execution of `onSearchChange` 
     * until the user stops typing for a specified time (1000ms).
     *
     * This helps reduce the number of API calls or state updates 
     * by only triggering the search after the user has paused typing.
     *
     * @param value The search input value entered by the user.
    */
    const debouncedOnSearchChange = useDebouncedCallback(
        (value: string) => {
            onSearchChange?.(value);
        },
        1000, // Delay in milliseconds before triggering `onSearchChange`
    );

    /**
     * Toggles the sort order of a column when the user clicks on its header.
     * 
     * Updates the `columns` state with the new sort order and calls the
     * `onSortingChange` callback with the new sort data.
     * @param sortField The field to sort by.
     * @param currentSort The current sort order of the column.
     */
    const handleSort = (sortField: string, currentSort: string) => {
        const newSort = currentSort === 'asc' ? 'desc' : 'asc';

        setColumns((prevColumns: typeof columns) =>
            prevColumns.map((col: typeof columns) =>
                col.sortField === sortField ? { ...col, sort: newSort } : col,
            ),
        );
        onSortingChange?.({ sortField, sort: newSort });
    };


    return (
        <div className="relative overflow-x-auto sm:rounded-lg rounded-lg border shadow border-[#eaecf0]">
            <div className="w-full p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 sm:block lg:flex justify-between items-center">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    {title && <span>{title}</span>}
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {`${paginationTotalRows} records`}
                    </span>
                </div>
                {isSearchShow && (
                    <div className="ml-auto flex items-center gap-2">
                        <TextInput
                            id="search"
                            name="search"
                            placeholder="Search"
                            icon={<Search />}
                            type="text"
                            onChange={(e) => debouncedOnSearchChange?.(e.target.value)}
                        />
                        <button
                            type="button"
                            className="
                                flex cursor-pointer justify-center items-center gap-2 py-2.5 px-5 text-sm font-medium text-gray-900 bg-white
                                rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700
                                focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-100
                                dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400
                                dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700
                            "
                            onClick={() => onMultipleRowDelete?.(selectedRows)}
                        >
                            <span className='hidden sm:block'>
                                <Delete />
                            </span>
                            <span className='whitespace-nowrap'>
                                Bulk Delete
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <div className='p-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
                {
                    quickFilters?.length > 0 && (
                        <div className='w-full sm:w-[50%]'>
                            <ToggleGroup options={quickFilters} onChange={(value) => onQuickFilterChange?.(value)} value={selectedQuickFilter}/>
                        </div>
                    )
                }
                {
                    multiSelectFilterOptions?.length > 0 && (
                        <div className='w-full sm:w-[50%]'>
                            <MultiSelectDropdown
                                id="multi-select"
                                label={multiSelectLabel}
                                options={multiSelectFilterOptions}
                                selectedValues={multiSelectValue}
                                onChange={(value) => {
                                    onMultiSelectChange?.(value);
                                }}
                                showLabel={false}
                                maxVisibleChips={3}
                            />
                        </div>
                    )
                }
            </div>
            <div className='overflow-y-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    {/* Table Header */}
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <input
                                    id="checkbox-all-search"
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </th>
                            {columns?.map((col: any, index: number) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => col.sortable && handleSort(col.sortField, col.sort)}
                                >
                                    {col.name}
                                    {col.sortable && (
                                        <span className="ml-2">
                                            {col.sort === 'asc' ? '▲' : '▼'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data?.length > 0 ? (
                            data?.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                >
                                    <th scope="col" className="p-4">
                                        <input
                                            id="checkbox-all-search"
                                            type="checkbox"
                                            className="text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => handleRowSelect(row.id)}
                                        />
                                    </th>
                                    {columns?.map((col: any, colIndex: number) => {
                                        const cellValue = typeof col.selector === 'function' ? col.selector(row) : row[col.selector];
                                        const displayValue = cellValue.length > 50 ? truncateString(cellValue, 50) : cellValue;
                                        return (
                                            <td key={colIndex} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" title={cellValue.length > 100 ? cellValue : ''}>
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns?.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {paginationTotalRows > rowsPerPage && (
                <div className="w-full p-4  flex justify-between items-center text-gray-700 dark:text-gray-300">
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`py-2.5 px-5 mr-2 mb-2 cursor-pointer text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${
                                currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`py-2.5 px-5 mr-2 mb-2 cursor-pointer text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${
                                currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                        >
                                Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Datatable;
