// React

// Next
import { Html, Head, Main, NextScript } from 'next/document';

// Constants

// Store

// Helpers

// Contexts

// Redux

// Apis

// Action

// Icon

// Layout

// Other components

// Type

// Styles

/**
 * Custom Document component for the Next.js application.
 *
 * This component is used to augment the default document structure
 * by providing a custom HTML structure. It defines the overall HTML
 * document layout, including <Html>, <Head>, <body>, and Next.js specific
 * components such as <Main> and <NextScript>.
 *
 * @returns {JSX.Element} The rendered document structure.
 */

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
