// React
import React from 'react';

// Constants

// Next

// Redux

// Icons
import Search from '@/assets/icons/search';

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
    rowsPerPage
}) => {

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
                {
                    isSearchShow &&
                    <div className="ml-auto">
                        <TextInput
                            id={'search'}
                            placeholder={'Search'}
                            icon={<Search />}
                            type={'text'}
                            onChange={(e) => debouncedOnSearchChange?.(e.target.value)}
                        />
                    </div>
                }
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                {/* Table Header */}
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
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
                                {columns?.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {typeof col.selector === 'function' ? col.selector(row) : row[col.selector]}
                                    </td>
                                ))}
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