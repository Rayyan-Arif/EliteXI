"use client";

import { formatDateTime } from "@/lib/clientUtils";
import { TournamentDetails } from "@/types/games";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const TournamentMatches = ({
    matches,
}: {
    matches: TournamentDetails["tournament_matches"];
}) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visibleMatches = matches.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-bold">Matches</h2>
            <p className="mt-1 text-sm text-gray-400">Fixtures played in this tournament.</p>

            <div className="mt-4 space-y-3">
                {visibleMatches.length > 0 ? (
                    visibleMatches.map((match) => (
                        <Link
                            key={match.game_id}
<<<<<<< HEAD
                            onClick={() => localStorage.setItem("match", JSON.stringify(match))}
=======
>>>>>>> e20b911618b407610e2432ed7712fac05003b0fa
                            href={`/user/matches/${match.game_id}`}
                            className="block bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-green-600 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="text-base font-bold">{match.game_name}</h3>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/20 text-blue-400 whitespace-nowrap">
                                    Match
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold">
                                {match.club1_name}{" "}
                                <span className="text-gray-400">
                                    {match.goals_club1 ?? 0} - {match.goals_club2 ?? 0}
                                </span>{" "}
                                {match.club2_name}
                            </p>

                            <p className="mt-3 text-sm text-gray-400">
                                Date:{" "}
                                <span className="text-gray-200 font-semibold">
                                    {formatDateTime(match.game_date)}
                                </span>
                            </p>

                            <p className="mt-3 text-sm text-blue-400 font-semibold">View match →</p>
                        </Link>
                    ))
                ) : (
                    <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3">
                        <p className="text-sm font-semibold text-white">No matches yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Fixtures will appear here once they are scheduled.
                        </p>
                    </div>
                )}
            </div>

            {matches.length > PAGE_SIZE && (
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

export default TournamentMatches;
