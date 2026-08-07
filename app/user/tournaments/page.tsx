"use client";

import TournamentCard from "@/app/components/userComponents/TournamentCard";
import { API_URL } from "@/lib/clientUtils";
import { TournamentOption } from "@/types/games";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 4;

const UserTournamentsPage = () => {
    const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadTournaments = async () => {
            try {
                const response = await fetch(`${API_URL}/tournaments`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                });

                if (!response.ok) return;

                const data = await response.json();
                if (data.status === "success") {
                    setTournaments(data.data.tournaments ?? []);
                }
            } catch {
                // keep existing UI state on fetch failure
            }
        };

        loadTournaments();
    }, []);

    const totalPages = Math.max(1, Math.ceil(tournaments.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visibleTournaments = tournaments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Competitions</p>
                <h1 className="mt-1 text-3xl font-extrabold">Tournaments</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Browse all tournaments and open one to see the full details.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {visibleTournaments.length > 0 ? (
                        visibleTournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.tournament_id}
                                tournament={tournament}
                            />
                        ))
                    ) : (
                        <div className="rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 sm:col-span-2 w-fit">
                            <p className="text-sm font-semibold text-white">No tournaments yet</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Tournaments will appear here once they are created.
                            </p>
                        </div>
                    )}
                </div>

                {tournaments.length > PAGE_SIZE && (
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
                            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default UserTournamentsPage;
