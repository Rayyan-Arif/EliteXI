"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminNavbar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
            <div className="px-6 py-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold tracking-wide">
                Elite<span className="text-green-600">XI</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
            <Link
                href="/admin"
                className={`block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${pathname === '/admin' && 'bg-gray-800 text-white font-semibold'}`}
            >
                Home
            </Link>
            <Link
                href="/admin/clubs"
                className={`block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${pathname === '/admin/clubs' && 'bg-gray-800 text-white font-semibold'}`}
            >
                Clubs
            </Link>
            <Link
                href="/admin/players"
                className={`block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${pathname === '/admin/players' && 'bg-gray-800 text-white font-semibold'}`}
            >
                Players
            </Link>
            <Link
                href="/admin/matches"
                className={`block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${pathname === '/admin/matches' && 'bg-gray-800 text-white font-semibold'}`}
            >
                Matches
            </Link>
            <Link
                href="/admin/tournaments"
                className={`block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${pathname === '/admin/tournaments' && 'bg-gray-800 text-white font-semibold'}`}
            >
                Tournaments
            </Link>
            </nav>
        </aside>
    )
}

export default AdminNavbar