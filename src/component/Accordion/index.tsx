import React, { useState } from 'react';

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

/**
 * A single accordion item.
 *
 * @prop {string} id - The HTML id of the accordion item.
 * @prop {string} title - The title of the accordion item.
 * @prop {React.ReactNode} children - The content of the accordion item.
 *
 * @example
 * <AccordionItem id="accordion-item-1" title="Item 1">
 *   <p>This is the content of the accordion item.</p>
 * </AccordionItem>
 */
const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Toggle the accordion item.
     *
     * @function
     *
     */
    const toggleAccordion = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <div id={id} data-accordion="open">
            <h2 id={`${id}-heading`}>
                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-body`}
                    onClick={toggleAccordion}
                >
                    <span className="flex items-center">
                        {title}
                    </span>
                    <svg
                        className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''} shrink-0`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>
            <div id={`${id}-body`} className={isOpen ? '' : 'hidden'} aria-labelledby={`${id}-heading`}>
                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface AccordionProps {
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
    return <div className="accordion">{children}</div>;
};

export { Accordion, AccordionItem };
