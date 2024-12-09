import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md z-50 h-[4rem]">
            <div className="w-full mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-lg font-bold">Medicine Adherence</Link>

                {/* Hamburger Menu (for mobile) */}
                <button className="text-2xl sm:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" >
                    {isOpen ? '✖' : '☰'}
                </button>

                {/* Links (hidden on mobile, visible on larger screens) */}
                <div className={`absolute top-full left-0 w-full sm:relative sm:top-auto sm:left-auto sm:w-auto sm:flex transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="sm:flex sm:space-x-6 text-center border-2 sm:border-0 bg-gray-100">
                        <li className="sm:py-0">
                            <Link to="/chat" className="block px-4 py-3 sm:px-0 hover:bg-gray-300 sm:hover:bg-transparent">
                                Chat
                            </Link>
                        </li>
                        <li className="sm:py-0">
                            <Link to="/profile" className="block px-4 py-3 sm:px-0 hover:bg-gray-300 sm:hover:bg-transparent">
                                Profile
                            </Link>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
