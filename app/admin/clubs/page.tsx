"use client";
import AdminManageClub from '@/app/components/adminComponents/AdminManageClub';
import { API_URL } from '@/lib/clientUtils';
import { AdminClub } from '@/types/club';
import React, { useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 8;

const AdminDashboardClubs = () => {
    const [clubs, setClubs] = useState<AdminClub[]>([]);
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        const fetchPendingClubs = async() => {        
            const res = await fetch(`${API_URL}/clubs/pending`, {credentials: 'include'});
        
            if(res.ok){
                const data = await res.json();

                if(data.status === 'success')
                    setClubs(data.data.clubs);
            }
        };

        fetchPendingClubs();
    }, []);

    const totalPages = Math.max(1, Math.ceil(clubs.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const visibleClubs = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return clubs.slice(start, start + PAGE_SIZE);
    }, [clubs, currentPage]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <main className="flex-1 px-6 py-10 overflow-auto">
            <div className="max-w-full">
            <p className="text-sm text-gray-400">Club requests</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">Pending Clubs</h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
                Review new clubs and choose to accept or reject each request.
            </p>

            <div className="mt-8 space-y-4">
                {
                    clubs.length > 0 ?
                    visibleClubs.map((club: AdminClub) => <AdminManageClub key={club.club_id} club={club} setClubs={setClubs}/>) :
                    <div className="w-fit max-w-md rounded-xl border border-gray-800 bg-gray-800/60 px-5 py-4">
                        <p className="text-base font-semibold text-white">No pending clubs</p>
                        <p className="mt-1 text-sm text-gray-400">
                            You’re all caught up. New club requests will show up here.
                        </p>
                    </div>
                }
            </div>

            {clubs.length > PAGE_SIZE && (
                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <p className="text-sm text-gray-400">
                        Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
                        <span className="text-white font-semibold">{totalPages}</span>
                    </p>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
            </div>
        </main>
    )
}

export default AdminDashboardClubs
