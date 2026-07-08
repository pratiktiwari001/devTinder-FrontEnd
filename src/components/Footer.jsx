import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        // Defined height (h-16 = 64px) and fixed position at the bottom.
        <footer className="
            fixed bottom-0 left-0 right-0 
            h-8 
            bg-gray-800 text-white 
            flex items-center justify-center 
            border-t border-gray-700
            z-20 
        ">
            <aside>
                <p className="text-sm font-light text-center">
                    Copyright © {currentYear} - All rights reserved by DevTinder Web
                </p>
            </aside>
        </footer>
    );
};

export default Footer;