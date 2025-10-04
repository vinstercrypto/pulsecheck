
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPoll, FaChartBar, FaInfoCircle } from 'react-icons/fa';

const Header = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Vote', icon: FaPoll },
        { href: '/results', label: 'Results', icon: FaChartBar },
        { href: '/about', label: 'About', icon: FaInfoCircle },
    ];

    return (
        <header className="bg-brand-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-tight text-white">
                    Pulse<span className="text-blue-400">Check</span>
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-brand-gray-300 hover:bg-brand-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
};

export default Header;
