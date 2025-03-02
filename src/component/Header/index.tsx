import React from 'react';

/**
 * Header component that displays the main navigation bar of the website.
 *
 * This component includes the website title and a navigation menu with links to
 * different sections of the site. The header is styled to be fixed at the top of
 * the page with a dark background and white text.
 *
 * @returns The header component.
 */

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white py-4 fixed w-full z-10">
            <div className="container mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
                <div className="text-xl font-semibold">My Website</div>
                <nav className="hidden space-x-6 sm:flex">
                    <a href="#" className="hover:text-gray-300">Home</a>
                    <a href="#" className="hover:text-gray-300">About</a>
                    <a href="#" className="hover:text-gray-300">Services</a>
                    <a href="#" className="hover:text-gray-300">Contact</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
