"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Settings, ShoppingCart, ArrowRightLeft, Trophy, CalendarDays, Lock } from "lucide-react";

const navItems = [
    { href: "/user/clubs", label: "Clubs", shortLabel: "Clubs", icon: Shield, locked: false },
    { href: "/user/players", label: "Manage Players", shortLabel: "Players", icon: Settings, locked: true },
    { href: "/user/buy", label: "Buy Players", shortLabel: "Buy", icon: ShoppingCart, locked: true },
    { href: "/user/transfers", label: "Transfers", shortLabel: "Transfers", icon: ArrowRightLeft, locked: true },
    { href: "/user/matches", label: "Matches", shortLabel: "Matches", icon: CalendarDays, locked: true },
    { href: "/user/tournaments", label: "Tournaments", shortLabel: "Cups", icon: Trophy, locked: true },
] as const;

const UserNavbar = ({clubStatus}: {clubStatus: boolean}) => {
    const pathname = usePathname();

    return (
        <>
            <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 min-h-screen lg:flex flex-col hidden">
                <div className="px-6 py-6 border-b border-gray-800">
                <span className="text-2xl font-bold tracking-wide">
                    Elite<span className="text-green-600">XI</span>
                </span>
                <p className="text-xs text-gray-400 mt-1">Manager Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
                {navItems.map((item) => {
                    const locked = item.locked && !clubStatus;
                    const href = locked ? "/user/clubs" : item.href;
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            className={`flex justify-between px-4 py-3 rounded-lg text-gray-400 ${locked ? 'cursor-not-allowed' : 'hover:text-white hover:bg-gray-800'} ${active ? 'bg-gray-800 text-white font-semibold' : ''}`}
                        >
                            <p className='flex gap-3 items-center'><Icon size={20}/> {item.label}</p>
                            {locked && <Lock size={18} />}
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
                        const locked = item.locked && !clubStatus;
                        const href = locked ? "/user/clubs" : item.href;
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={href}
                                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[10px] leading-tight sm:text-xs ${
                                    active
                                        ? "bg-gray-800 text-white font-semibold"
                                        : "text-gray-400"
                                } ${locked ? "opacity-70" : "hover:text-white"}`}
                            >
                                <span className="relative inline-flex">
                                    <Icon size={18} className="shrink-0" />
                                    {locked && (
                                        <Lock
                                            size={10}
                                            className="absolute -right-1.5 -top-1 text-gray-300"
                                        />
                                    )}
                                </span>
                                <span className="truncate w-full text-center">{item.shortLabel}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    )
}

export default UserNavbar
