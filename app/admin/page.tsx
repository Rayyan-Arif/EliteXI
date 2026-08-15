import React from 'react'
import Link from 'next/link'
import { AdminStats } from '@/types/user'
<<<<<<< HEAD
import { API_URL } from '@/lib/clientUtils';
=======
import { API_URL } from '@/lib/helper';
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
import { getAdminStats } from '@/lib/user';

const AdminDashboardHome = async () => {
    const stats: AdminStats = await getAdminStats(); 

    return (
        <main className="flex-1 px-6 py-10 overflow-auto">
            <div className="max-w-5xl">
            <p className="text-sm text-gray-400">Welcome back</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
                Your EliteXI overview
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
                A quick look at how your platform is doing today. Clubs, players, matches, and tournaments in one place.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Active Clubs</p>
<<<<<<< HEAD
                <p className="mt-2 text-3xl font-bold text-green-500">{stats?.clubs_created?.approved_clubs ?? 0}</p>
                <p className="mt-1 text-xs text-gray-400">{stats?.clubs_created?.pending_clubs ?? 0} waiting for approval</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Players</p>
                <p className="mt-2 text-3xl font-bold text-blue-500">{stats?.players_created ?? 0}</p>
=======
                <p className="mt-2 text-3xl font-bold text-green-500">{stats.clubs_created.approved_clubs}</p>
                <p className="mt-1 text-xs text-gray-400">{stats.clubs_created.pending_clubs ?? 0} waiting for approval</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Players</p>
                <p className="mt-2 text-3xl font-bold text-blue-500">{stats.players_created}</p>
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
                <p className="mt-1 text-xs text-gray-400">Available on the market</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Matches</p>
<<<<<<< HEAD
                <p className="mt-2 text-3xl font-bold text-yellow-500">{stats?.matches_scheduled ?? 0}</p>
=======
                <p className="mt-2 text-3xl font-bold text-yellow-500">{stats.matches_scheduled}</p>
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
                <p className="mt-1 text-xs text-gray-400">Scheduled till now</p>
                </article>
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400">Tournaments</p>
<<<<<<< HEAD
                <p className="mt-2 text-3xl font-bold text-green-500">{stats?.tournaments_held ?? 0}</p>
=======
                <p className="mt-2 text-3xl font-bold text-green-500">{stats.tournaments_held}</p>
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
                <p className="mt-1 text-xs text-gray-400">Competitions held</p>
                </article>
            </div>

            <div className="gap-6 mt-8 w-full">
                <article className="bg-gray-800 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold">What needs attention</h2>
                <p className="text-gray-400 mt-2 text-sm">Friendly reminders so you never miss important actions.</p>
                <ul className="mt-5 space-y-3 text-sm">
                    {
<<<<<<< HEAD
                        stats?.clubs_created?.pending_clubs ? 
                        <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span><span className="font-semibold text-white">{stats?.clubs_created?.pending_clubs} clubs</span> are waiting for your approval.</span>
=======
                        stats.clubs_created.pending_clubs ? 
                        <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span><span className="font-semibold text-white">{stats.clubs_created.pending_clubs} clubs</span> are waiting for your approval.</span>
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
                        </li> : <li>No reminders yet.</li>
                    }
                    {/* <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                    <span><span className="font-semibold text-white">5 transfer requests</span> need a decision.</span>
                    </li>
                    <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span><span className="font-semibold text-white">2 matches</span> are ready to be scheduled.</span>
                    </li> */}
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