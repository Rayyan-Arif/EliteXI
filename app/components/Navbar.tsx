'use client';

import React, { useContext, useState } from 'react'
import Link from 'next/link';
import { API_URL } from "@/lib/clientUtils";
import { scrollToComponent } from '@/lib/clientUtils';
import { UserContext } from '@/lib/contexts';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const {user, setUser} = useContext(UserContext)!;

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/users/logout`, { method: 'POST', credentials: 'include' });
        } finally {
            setUser(null);
            setIsOpen(false);
            router.push('/');
            router.refresh();
        }
    };

    return (
        <header className="bg-surface border-b border-card sticky top-0 w-full z-100">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href='/' className="text-2xl font-bold tracking-wide">
                    Elite<span className="text-primary">XI</span>
                </Link>

                <nav className="hidden md:flex space-x-4 text-sm items-center">
                    <span onClick={() => scrollToComponent("benefits")} className="cursor-pointer text-muted hover:text-white">Why EliteXI</span>
                    <span onClick={() => scrollToComponent("how")} className="cursor-pointer text-muted hover:text-white">How It Works</span>
                    {user ? (
                        <>
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/user/clubs'} className="px-4 py-2 rounded-md bg-secondary text-white font-semibold cursor-pointer">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-secondary text-white font-semibold cursor-pointer">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/auth" className="px-4 py-2 rounded-md bg-secondary text-white font-semibold">
                            Get Started
                        </Link>
                    )}
                </nav>

                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-card text-white"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {isOpen && (
                <nav className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm bg-surface border-t border-card">
                    <span onClick={() => scrollToComponent("benefits")} className="cursor-pointer text-muted hover:text-white">Why EliteXI</span>
                    <span onClick={() => scrollToComponent("how")} className="cursor-pointer text-muted hover:text-white">How It Works</span>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/user/clubs'} className="px-4 py-2 rounded-md bg-secondary text-white font-semibold cursor-pointer">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-secondary text-white font-semibold cursor-pointer">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md bg-secondary text-white font-semibold">
                            Get Started
                        </Link>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Navbar