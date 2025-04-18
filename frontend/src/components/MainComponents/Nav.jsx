import React from 'react';
import { Leaf, UserPlus, LogIn, Sprout, Users, BookOpen, Mail, Info } from 'lucide-react';

const Nav = () => {
    return (
        <nav className="bg-gradient-to-r from-green-600 to-lime-500 text-white py-4 px-6 shadow-lg rounded-b-3xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
               
                <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-lime-100" />
                    <span className="text-2xl font-extrabold tracking-wider text-white">GrowSphere</span>
                </div>

                
                <ul className="flex items-center space-x-8 font-medium text-white text-sm">
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <BookOpen className="w-4 h-4" />
                        <a href="#tutorial">Tutorial</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <Users className="w-4 h-4" />
                        <a href="#community">Community</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <Sprout className="w-4 h-4" />
                        <a href="/challenge-home">Challenges</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <Info className="w-4 h-4" />
                        <a href="#about">About Us</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <Mail className="w-4 h-4" />
                        <a href="#contact">Contact Us</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <LogIn className="w-4 h-4" />
                        <a href="/login">Login</a>
                    </li>
                    <li className="flex items-center space-x-1 hover:text-lime-200 transition">
                        <UserPlus className="w-4 h-4" />
                        <a href="/register">Signup</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Nav;
