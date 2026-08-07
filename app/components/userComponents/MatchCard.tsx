"use client";

import { formatDateTime } from "@/lib/clientUtils";
import { Match } from "@/types/games";
import Link from "next/link";
import React from "react";

const MatchCard = ({ isMatchOurs, match }: { isMatchOurs: boolean; match: Match }) => {
    return (
        <Link
            href={`/user/matches/${match.game_id}`}
            onClick={() => {
                localStorage.setItem("match", JSON.stringify(match));
            }}
            className={`block bg-gray-800 border border-gray-700 rounded-xl p-5 transition-colors ${
                isMatchOurs ? "hover:border-green-600" : "hover:border-blue-600"
            }`}
        >
            <p className="text-xl font-bold p-2 bg-gray-500/20 rounded-xl mb-4 w-full">
                Game: {match.game_name}
            </p>
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">
                    {match.club1_name} <span className="text-gray-500">vs</span> {match.club2_name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {match.has_game_started === 1 ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap bg-red-500/20 text-red-400">
                            Live
                        </span>
                    ) : ''}
                    {match.has_game_started === 2 ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded whitespace-nowrap bg-emerald-500/20 text-emerald-400">
                            Finished
                        </span>
                    ) : ''}
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                            isMatchOurs
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                        {isMatchOurs ? "Yours" : "Other"}
                    </span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400">Date</p>
                    <p className="mt-1 font-semibold">{formatDateTime(match.game_date)}</p>
                </div>
                <div>
                    <p className="text-gray-400">Prize</p>
                    <p className="mt-1 font-semibold">{Math.round(+match.winning_price)} Coins</p>
                </div>
            </div>

            {match.tournament_name && (
                <p className="mt-3 text-sm text-gray-400">
                    Tournament: <span className="text-gray-200 font-semibold">{match.tournament_name}</span>
                </p>
            )}

            <p className="mt-4 text-sm text-blue-400 font-semibold">View match →</p>
        </Link>
    );
};

export default MatchCard;
