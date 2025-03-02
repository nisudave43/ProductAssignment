import React from 'react';

/**
 * A simple footer component.
 *
 * It displays a copyright notice and links to the privacy policy and terms of
 * service.
 *
 * @returns The footer component.
 */
const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto flex flex-col items-center sm:flex-row sm:justify-between">
                <div>&copy; 2025 My Website. All rights reserved.</div>
                <div className="hidden space-x-6 sm:flex">
                    <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
