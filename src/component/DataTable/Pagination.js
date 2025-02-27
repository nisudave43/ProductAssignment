// react
import React from 'react';

// helpers
import styleClasses from '@/helpers/styleClasses';
import { useTranslation } from 'react-i18next';

// components
import Button from '@/components/Button';

// styles
import styles from '@/components/DataTable/DataTable.module.scss';

const cls = styleClasses(styles);


const Pagination = ({
    rowsPerPage,
    rowCount,
    currentPage,
    onChangePage,
    // other props from library to use if needed
    // direction,
    // paginationRowsPerPageOptions,
    // paginationIconLastPage,
    // paginationIconFirstPage,
    // paginationIconNext,
    // paginationIconPrevious,
    // paginationComponentOptions,
    // onChangeRowsPerPage,
}) => {
    const { t } = useTranslation('components/datatable');
    const totalPages = Math.ceil(rowCount / rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) {
            onChangePage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onChangePage(currentPage + 1);
        }
    };

    return (
        <div className={cls`pagination`}>
            <div className={cls`page-indicator`}>
                {t('pagination.pageIndicator', {currentPage, totalPages})}
            </div>

            <div className={cls`pagination-buttons`}>
                <Button onClick={handlePrev} disabled={currentPage === 1} variant="secondary">
                    {t('pagination.prevBtn')}
                </Button>

                <Button onClick={handleNext} disabled={currentPage === totalPages} variant="secondary">
                    {t('pagination.nextBtn')}
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
