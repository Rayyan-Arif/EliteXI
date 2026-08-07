"use client";

import { TournamentOption } from "@/types/games";
import Link from "next/link";
import React from "react";

const TournamentCard = ({ tournament }: { tournament: TournamentOption }) => {
    return (
        <Link
            href={`/user/tournaments/${tournament.tournament_id}`}
            className="block bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-green-600 transition-colors"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{tournament.name}</h3>
                <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap bg-green-500/20 text-green-400">
                    Tournament
                </span>
            </div>

            <div className="mt-4 text-sm">
                <p className="text-gray-400">Total Teams</p>
                <p className="mt-1 font-semibold text-white">{tournament.no_of_teams ?? "—"}</p>
            </div>

            <p className="mt-4 text-sm text-blue-400 font-semibold">View tournament →</p>
        </Link>
    );
};

export default TournamentCard;
