// React
import React, { useState } from 'react';

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
    onMultipleDelete: (selectedRows: string[]) => void
}

const Datatable: React.FC<DatatableProps> = ({
    columns,
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
    onMultipleRowDelete
}) => {

    const [selectedRows, setSelectedRows] = useState(selectedRow?.length ? selectedRow : []);
    const [selectAll, setSelectAll] = useState(false);

    interface RowData {
        id: string | number;
        [key: string]: any; // Allow additional fields in row data
    }

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
    const handleRowSelect = (id: string | number): void => {
        setSelectedRows((prevSelected) => {
            const newSelected = prevSelected.includes(id)
                ? prevSelected.filter((rowId) => rowId !== id)
                : [...prevSelected, id];
            const selectedData = data.filter((row) => newSelected.includes(row.id));
            onRowSelect?.(selectedData); // Callback with selected row data
            return newSelected;
        });
    };
    const debouncedOnSearchChange = useDebouncedCallback(
        (value: string) => {
            onSearchChange?.(value);
        },
        1000
    );

    return (
        <div className="relative overflow-x-auto sm:rounded-lg rounded-lg border shadow border-[#eaecf0]">
           <div className="w-full p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                {title && <span>{title}</span>}
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {`${paginationTotalRows} records`}
                </span>
            </div>
            {isSearchShow && (
                <div className="ml-auto flex items-center gap-2">
                    <TextInput
                        id="search"
                        placeholder="Search"
                        icon={<Search />}
                        type="text"
                        onChange={(e) => debouncedOnSearchChange?.(e.target.value)}
                    />
                    <button
                        type="button"
                        className="
                            flex cursor-pointer align-items-center gap-2 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white 
                            rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 
                            focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-100 
                            dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
                            dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700
                        "
                        onClick={() => onMultipleRowDelete?.(selectedRows)}
                        >
                        <Delete /> Bulk Delete
                    </button>
                </div>
            )}
        </div>


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
                        {columns?.map((col, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {col.name}
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
                               {columns?.map((col, colIndex) => {
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