import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="
            w-full mt-auto
            bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400
            border-t border-slate-200 dark:border-slate-800
            py-6 px-4 md:px-8
            transition-all duration-500
        ">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Copyright Section */}
                <aside className="text-sm font-medium tracking-wide flex items-center gap-1.5">
                    <span>Copyright © {currentYear}</span>
                    <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
                    <span>
                        All rights reserved by{' '}
                        {/* 🚀 EXACT matching gradient to the Navbar & Login Page */}
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            DevTinder
                        </span>
                    </span>
                </aside>

                {/* Optional Links */}
                <nav className="flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                    <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                        Terms of Service
                    </a>
                    <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                        Contact
                    </a>
                </nav>
                
            </div>
        </footer>
    );
};

export default Footer;