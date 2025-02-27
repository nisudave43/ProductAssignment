

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
import * as Popover from '@radix-ui/react-popover';
import Icons from '@/components/Icon/Icons';
import CheckBox from '@/components/Inputs/CheckBox';

//Styles
import styles from '@/components/DataTable/Configuration/Configuration.module.scss';

// Data table configuration component
const Configuration = (props) => {

    const {
        columns,  // list of columns
        setColumns, // a function to update the 'columns' state.
        isConfigurationPopoverShow, // A boolean value that determines whether the configuration popover is currently visible or hidden.
        onClose, // A function that will be triggered when the popover is closed, possibly to reset or perform some actions upon closing.
    } = props;

    const { t } = useTranslation('components/datatable/configuration');


    /**
     * Converts an array of objects into an array of key-value pairs.
     * Each key-value pair is an object with a 'label' and 'value' property,
     * both set to the value of the 'name' field in the original array objects.
     *
     * @param {Array} arr - The input array of objects, where each object has a 'name' property.
     * @returns {Array} - An array of objects with 'label' and 'value' properties.
     */
    const getKeyValuePairsArray = (arr) => {
        return arr.reduce((acc, item) => {
            acc.push({ label: item.name, value: item.name });
            return acc;
        }, []);
    };

    /**
     * Updates the visibility (omit status) of columns based on the provided column names.
     *
     * @param {Array} columnName - An array of column names that should remain visible.
     *                             If a column's name is not in this array, its 'omit' property
     *                             will be set to 'true', hiding the column.
     *
     * If the 'columnName' array contains valid names, the function maps over the current 'columns'
     * and updates the 'omit' property for each column:
     * - If the column name is found in 'columnName', 'omit' is set to false (column visible).
     * - If not found, 'omit' is set to true (column hidden).
     *
     * Finally, it updates the state of 'columns' using 'setColumns'.
     */
    const onColumnVisibilityChange = (columnName) => {

        if(columnName?.length > 0) {
            const updatedColumns = columns?.map(column => ({
                ...column,
                omit: columnName.indexOf(column.name) === -1,
            }));

            setColumns?.(updatedColumns);
        }
    };

    /**
     * Retrieves the names of columns that are not omitted (i.e., have 'omit' set to false).
     *
     * @returns {Array} - An array of column names where the 'omit' property is false.
     *
     * This function filters the 'columns' array to find the columns where 'omit' is false
     * (indicating the column is visible), and then maps the filtered result to return
     * an array of just the column names.
     */
    const getNamesWithOmitFalse = () => {
        return columns
            .filter(item => item.omit === false)
            .map(item => item.name);
    };

    /**
     * Resets the visibility of all columns by setting the 'omit' property to false for each column.
     *
     * This function maps over the current 'columns' array and sets the 'omit' property of every column
     * to 'false', making all columns visible. It then updates the state with the modified columns array.
     */
    const onColumnVisibilityReset = () => {
        const updatedColumns = columns?.map(column => ({
            ...column,
            omit: false,
        }));

        // Update the state with all columns having omit set to false
        setColumns?.(updatedColumns);
    };

    return (
        <Popover.Root open={isConfigurationPopoverShow} onOpenChange={onClose}>
            <Popover.Trigger asChild>
                <div className={styles['popover-trigger']}>
                    <Icons.Settings04 />
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className={`${styles['popup-content-wrapper']} ${styles['configuration-wrap']}`} side="bottom" align="end" sideOffset={8}>
                    <div className={styles['columns-attribute-wrap']}>
                        <div className={styles['heading']}>{t('title')}</div>
                        <div className={styles['description']}>{t('description')}</div>

                        <div className={styles['column-wrap']}>
                            <CheckBox
                                options={getKeyValuePairsArray(columns)}
                                variant={'vertical'}
                                optionsListVariant={'vertical'}
                                onChange={(value) => {
                                    onColumnVisibilityChange(value);
                                }}
                                value={getNamesWithOmitFalse()}
                            />
                        </div>
                        <div className={styles['divider']} />
                        <div className={styles['configuration-btn-wrap']}>
                            <Button
                                size={'sm'}
                                variant={'secondary'}
                                onClick={() => {
                                    onColumnVisibilityReset();
                                }}>
                                {t('reset')}
                            </Button>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default Configuration;
