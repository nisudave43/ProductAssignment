// components/ThemeProvider.js

import { createContext, useContext, useState, useEffect } from 'react';

import { THEME_DATA_ATTRIBUTE_NAME,SUPPORTED_THEME } from '@/constants/configuration';

import { store } from '@/store/store';

import createCookie from '@/helpers/createCookie';

const ThemeContext = createContext();

const supportSystemTheme = false;

export const ThemeProvider = ({ children, defaultTheme }) => {

    const [theme, setTheme] = useState(defaultTheme);

    const systemSelectedTheme = 'system';

    const user = store?.getState()?.user?.data || {};

    useEffect(() => {

        // Check if the browser supports the `prefers-color-scheme` media query
        if (false && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && theme === 'system') {
            setThemeAttribute('dark');
        }

        // Add a listener for changes in the OS theme
        const darkModeListener = (event) => {
            let systemTheme = '';
            if(event?.matches) {
                systemTheme = 'dark';
            } else {
                systemTheme = 'light';
            }

            if(systemTheme != theme) {
                setThemeAttribute(systemTheme);
            }
        };

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        supportSystemTheme && darkModeMediaQuery.addEventListener('change', darkModeListener);

        // Clean up the listener when the component unmounts
        return () => {
            darkModeMediaQuery.removeEventListener('change', darkModeListener);
        };
    }, []);

    // Function to toggle theme between light and dark
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        // Set the data-theme attribute on the root element
        setThemeAttribute(newTheme);
    };

    // function to set new theme
    const changeTheme = (theme) => {
        // Set the data-theme attribute on the root element
        setThemeAttribute(theme);
    };

    // function to set data theme attribute at html level
    const setThemeAttribute = (theme) => {
        if (Object.values(SUPPORTED_THEME).indexOf(theme) !== -1) {
            setTheme(theme);
            document.documentElement.setAttribute(THEME_DATA_ATTRIBUTE_NAME, theme);
            updateUserTheme(theme);
        }
    };

    // Function to change theme based on system or os theme
    const onSystemThemeMode = () => {
        // Check if the browser supports the `prefers-color-scheme` media query
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeAttribute('dark', systemSelectedTheme);
        } else {
            setThemeAttribute('light', systemSelectedTheme);
        }
    };

    const updateUserTheme = async (theme) => {
        const userPreferences = user?.userPreferences || {};

        userPreferences['theme'] = theme;
        createCookie('theme',theme);
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, changeTheme, onSystemThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
