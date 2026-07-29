"use client";

import { formatDateTime } from "@/lib/clientUtils";
import { API_URL } from "@/lib/helper";
import { AdminClub } from "@/types/club";
import { useState } from "react";

const AdminManageClub = ({club, setClubs}: {club: AdminClub, setClubs: React.Dispatch<React.SetStateAction<never[]>>}) => {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/clubs/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ club_id: club.club_id }),
                credentials: 'include',
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) return;

            setClubs(prev => prev.filter((c: AdminClub) => c.club_id !== club.club_id));
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/clubs/reject`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ club_id: club.club_id }),
                credentials: 'include',
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok && response.status !== 204) return;

            setClubs(prev => prev.filter((c: AdminClub) => c.club_id !== club.club_id));
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="bg-gray-800 border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Club name</p>
                <h2 className="mt-1 text-lg font-bold">{club.name}</h2>
                <p className="mt-2 text-sm text-gray-400">
                Created at: &nbsp;
                <span className="text-gray-200">{formatDateTime(club.created_at)}</span>
                </p>
            </div>
            <div className="flex gap-3">
                <button
                type="button"
                disabled={loading}
                onClick={handleReject}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {loading ? 'Processing...' : 'Reject'}
                </button>
                <button
                type="button"
                disabled={loading}
                onClick={handleApprove}
                className="cursor-pointer px-4 py-2 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {loading ? 'Processing...' : 'Approve'}
                </button>
            </div>
        </article>
    )
}

export default AdminManageClub
