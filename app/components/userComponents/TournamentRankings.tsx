"use client";

import { TournamentDetails } from "@/types/games";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const TournamentRankings = ({
    rankings,
}: {
    rankings: TournamentDetails["tournament_rankings"];
}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(rankings.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visibleRankings = rankings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-bold">Rankings</h2>
            <p className="mt-1 text-sm text-gray-400">Current standings in this tournament.</p>

            <div className="mt-4 space-y-3">
                {visibleRankings.length > 0 ? (
                    visibleRankings.map((ranking) => (
                        <article
                            key={ranking.club_id}
                            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-600/20 text-green-400 font-bold text-sm shrink-0">
                                    #{ranking.tournament_rank}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{ranking.club_name}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-800 text-gray-300 whitespace-nowrap">
                                Rank {ranking.tournament_rank}
                            </span>
                        </article>
                    ))
                ) : (
                    <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3">
                        <p className="text-sm font-semibold text-white">No rankings yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Teams will appear here once they join the tournament.
                        </p>
                    </div>
                )}
            </div>

            {rankings.length > PAGE_SIZE && (
                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export default TournamentRankings;
