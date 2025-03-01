import { Html, Head, Main, NextScript } from 'next/document';
import { DEFAULT_THEME, THEME_DATA_ATTRIBUTE_NAME } from '@/constants/configuration';

export default function Document() {

    const attributeProps = {
        [THEME_DATA_ATTRIBUTE_NAME]:  DEFAULT_THEME || 'light',
    };
    return (
        <Html lang="en" {...attributeProps}>
            <Head />
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
