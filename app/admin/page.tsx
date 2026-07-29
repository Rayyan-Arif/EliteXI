import React from 'react'
import Link from 'next/link'

const AdminDashboardHome = () => {
    return (
        <main className="flex-1 px-6 py-10 overflow-auto">
            <div className="max-w-5xl">
            <p className="text-sm text-gray-400">Welcome back</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
                Your EliteXI overview
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
                A quick look at how your platform is doing today — clubs, players, matches, and tournaments in one place.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Active Clubs</p>
                <p className="mt-2 text-3xl font-bold text-green-500">24</p>
                <p className="mt-1 text-xs text-gray-400">3 waiting for approval</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Players</p>
                <p className="mt-2 text-3xl font-bold text-blue-500">312</p>
                <p className="mt-1 text-xs text-gray-400">18 available on the market</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Matches</p>
                <p className="mt-2 text-3xl font-bold text-yellow-500">8</p>
                <p className="mt-1 text-xs text-gray-400">Scheduled this week</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Tournaments</p>
                <p className="mt-2 text-3xl font-bold text-green-500">2</p>
                <p className="mt-1 text-xs text-gray-400">Live competitions</p>
                </article>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold">What needs attention</h2>
                <p className="text-gray-400 mt-2 text-sm">Friendly reminders so you never miss important actions.</p>
                <ul className="mt-5 space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span><span className="font-semibold text-white">3 clubs</span> are waiting for your approval.</span>
                    </li>
                    <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <span><span className="font-semibold text-white">5 transfer requests</span> need a decision.</span>
                    </li>
                    <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span><span className="font-semibold text-white">2 matches</span> are ready to be scheduled.</span>
                    </li>
                </ul>
                </article>

                <article className="bg-gray-800 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold">Recent activity</h2>
                <p className="text-gray-400 mt-2 text-sm">A simple snapshot of what happened lately.</p>
                <ul className="mt-5 space-y-4 text-sm">
                    <li className="border-b border-gray-700 pb-3">
                    <p className="font-semibold">New club created</p>
                    <p className="text-gray-400 mt-1">Northern United joined and is pending review.</p>
                    </li>
                    <li className="border-b border-gray-700 pb-3">
                    <p className="font-semibold">Tournament updated</p>
                    <p className="text-gray-400 mt-1">Spring Cup now has 8 teams registered.</p>
                    </li>
                    <li>
                    <p className="font-semibold">Match completed</p>
                    <p className="text-gray-400 mt-1">City FC beat Riverside 2–1 in a friendly.</p>
                    </li>
                </ul>
                </article>
            </div>

            <article className="bg-gray-800 border border-gray-800 rounded-xl p-6 mt-8">
                <h2 className="text-xl font-bold">Quick tips</h2>
                <p className="text-gray-400 mt-2 max-w-3xl">
                Use the menu on the left to open Clubs, Players, Matches, or Tournaments.
                Start with pending club approvals, then check transfers and upcoming fixtures to keep the season running smoothly.
                </p>
            </article>
            </div>
        </main>
    )
}

export default AdminDashboardHome