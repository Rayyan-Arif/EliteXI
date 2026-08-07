"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shield, Users, CalendarDays, Trophy } from "lucide-react";

const navItems = [
    { href: "/admin", label: "Home", shortLabel: "Home", icon: Home, exact: true },
    { href: "/admin/clubs", label: "Clubs", shortLabel: "Clubs", icon: Shield, exact: false },
    { href: "/admin/players", label: "Players", shortLabel: "Players", icon: Users, exact: false },
    { href: "/admin/matches", label: "Matches", shortLabel: "Matches", icon: CalendarDays, exact: false },
    { href: "/admin/tournaments", label: "Tournaments", shortLabel: "Cups", icon: Trophy, exact: false },
] as const;

const AdminNavbar = () => {
    const pathname = usePathname();

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <>
            <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 min-h-screen lg:flex flex-col hidden">
                <div className="px-6 py-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold tracking-wide">
                        Elite<span className="text-green-600">XI</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, item.exact);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 ${active ? 'bg-gray-800 text-white font-semibold' : ''}`}
                            >
                                <p className="flex gap-3 items-center">
                                    <Icon size={20} /> {item.label}
                                </p>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
                aria-label="Mobile navigation"
            >
                <div className="flex items-stretch justify-between gap-0.5 px-1 pt-1.5 pb-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, item.exact);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[10px] leading-tight sm:text-xs ${
                                    active
                                        ? "bg-gray-800 text-white font-semibold"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className="truncate w-full text-center">{item.shortLabel}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    )
}

export default AdminNavbar
