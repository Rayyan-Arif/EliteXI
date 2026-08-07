"use client";

import TournamentMatches from "@/app/components/userComponents/TournamentMatches";
import TournamentRankings from "@/app/components/userComponents/TournamentRankings";
import { API_URL } from "@/lib/clientUtils";
import { TournamentDetails } from "@/types/games";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserTournamentDetailsPage = () => {
    const params = useParams();
    const tournamentId = String(params.tournament_id ?? "");

    const [details, setDetails] = useState<TournamentDetails | null>(null);
    const [activeTab, setActiveTab] = useState<"Rankings" | "Matches">("Rankings");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!tournamentId) return;

        const loadDetails = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                });
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    setError(data?.message ?? "Unable to load tournament details.");
                    return;
                }

                if (data.status === "success") {
                    setDetails(data.data.details);
                }
            } catch {
                setError("Unable to load tournament details right now.");
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [tournamentId]);

    if (loading) {
        return (
            <main className="flex-1 w-full px-6 py-8 overflow-auto">
                <p className="text-gray-400">Loading tournament...</p>
            </main>
        );
    }

    if (error || !details) {
        return (
            <main className="flex-1 w-full px-6 py-8 overflow-auto">
                <p className="text-red-500">{error || "Tournament not found."}</p>
            </main>
        );
    }

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Tournament details</p>
                <h1 className="mt-1 text-3xl font-extrabold">
                    {details.tournament_details.name || "Tournament"}
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                    Teams allowed:{" "}
                    <span className="text-gray-200 font-semibold">
                        {details.tournament_details.no_of_teams}
                    </span>
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {(["Rankings", "Matches"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold ${
                                activeTab === tab
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-800 text-gray-300 border border-gray-700"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {activeTab === "Rankings" ? (
                        <TournamentRankings rankings={details.tournament_rankings} />
                    ) : (
                        <TournamentMatches matches={details.tournament_matches} />
                    )}
                </div>
            </div>
        </main>
    );
};

export default UserTournamentDetailsPage;
