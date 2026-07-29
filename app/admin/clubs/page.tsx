"use client";
import AdminManageClub from '@/app/components/adminComponents/AdminManageClub';
import { API_URL } from '@/lib/helper';
import { AdminClub } from '@/types/club';
import React, { useEffect, useState } from 'react'

const AdminDashboardClubs = () => {
    const [clubs, setClubs] = useState([]);
    
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
                    clubs.map((club: AdminClub) => <AdminManageClub key={club.club_id} club={club} setClubs={setClubs}/>) :
                    <div className="w-fit max-w-md rounded-xl border border-gray-800 bg-gray-800/60 px-5 py-4">
                        <p className="text-base font-semibold text-white">No pending clubs</p>
                        <p className="mt-1 text-sm text-gray-400">
                            You’re all caught up. New club requests will show up here.
                        </p>
                    </div>
                }
            </div>
            </div>
        </main>
    )
}

export default AdminDashboardClubs