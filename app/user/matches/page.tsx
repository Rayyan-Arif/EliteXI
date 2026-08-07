"use client";

import MatchCard from "@/app/components/userComponents/MatchCard";
import { API_URL } from "@/lib/clientUtils"; 
import { Match } from "@/types/games";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 6;

const STATUS_FILTERS = [
    { label: "Upcoming", value: 0 },
    { label: "Live", value: 1 },
    { label: "Finished", value: 2 },
] as const;

const EMPTY_MESSAGES: Record<number, { title: string; your: string; other: string }> = {
    0: {
        title: "upcoming",
        your: "Upcoming fixtures involving your club will show up here.",
        other: "Other clubs' upcoming fixtures will appear here.",
    },
    1: {
        title: "live",
        your: "Live matches involving your club will show up here.",
        other: "Other clubs' live matches will appear here.",
    },
    2: {
        title: "finished",
        your: "Finished matches involving your club will show up here.",
        other: "Other clubs' finished matches will appear here.",
    },
};

const UserMatchesPage = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [clubId, setClubId] = useState<number | null>(null);
    const [status, setStatus] = useState<number>(0);
    const [yourPage, setYourPage] = useState(1);
    const [otherPage, setOtherPage] = useState(1);

    useEffect(() => {
        const loadClub = async () => {
            try {
                const clubRes = await fetch(`${API_URL}/clubs`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                });

                if (clubRes.ok) {
                    const data = await clubRes.json();
                    if (data.status === "success") {
                        setClubId(data.data.club?.club_id ?? null);
                    }
                }
            } catch {
                // keep existing UI state on fetch failure
            }
        };

        loadClub();
    }, []);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const matchesRes = await fetch(`${API_URL}/matches?status=${status}`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                });

                if (matchesRes.ok) {
                    const data = await matchesRes.json();
                    if (data.status === "success") {
                        setMatches(data.data.matches ?? []);
                    }
                }
            } catch {
                // keep existing UI state on fetch failure
            }
        };

        loadMatches();
    }, [status]);

    const yourMatches = !clubId
        ? []
        : matches.filter(
            (match) => match.club1_id === clubId || match.club2_id === clubId
        );

    const otherMatches = !clubId
        ? matches
        : matches.filter(
            (match) => match.club1_id !== clubId && match.club2_id !== clubId
        );

    const yourTotalPages = Math.max(1, Math.ceil(yourMatches.length / PAGE_SIZE));
    const otherTotalPages = Math.max(1, Math.ceil(otherMatches.length / PAGE_SIZE));
    const currentYourPage = Math.min(yourPage, yourTotalPages);
    const currentOtherPage = Math.min(otherPage, otherTotalPages);

    const visibleYourMatches = yourMatches.slice(
        (currentYourPage - 1) * PAGE_SIZE,
        currentYourPage * PAGE_SIZE
    );
    const visibleOtherMatches = otherMatches.slice(
        (currentOtherPage - 1) * PAGE_SIZE,
        currentOtherPage * PAGE_SIZE
    );

    useEffect(() => {
        if (yourPage > yourTotalPages) setYourPage(yourTotalPages);
    }, [yourPage, yourTotalPages]);

    useEffect(() => {
        if (otherPage > otherTotalPages) setOtherPage(otherTotalPages);
    }, [otherPage, otherTotalPages]);

    const emptyMessages = EMPTY_MESSAGES[status];

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Fixtures</p>
                <h1 className="mt-1 text-3xl font-extrabold">Matches</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Follow your club’s fixtures and see what’s happening around the league.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => {
                                setStatus(filter.value);
                                setYourPage(1);
                                setOtherPage(1);
                            }}
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold ${
                                status === filter.value
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-800 text-gray-300 border border-gray-700"
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <section className="mt-8">
                    <h2 className="text-xl font-bold">Your Matches</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {status === 0 && "Games where your club is scheduled to play."}
                        {status === 1 && "Games where your club is currently playing."}
                        {status === 2 && "Games your club has already played."}
                    </p>

                    <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {visibleYourMatches.length > 0 ? (
                            visibleYourMatches.map((match) => (
                                <MatchCard key={match.game_id} isMatchOurs={true} match={match} />
                            ))
                        ) : (
                            <div className="rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 sm:col-span-2 xl:col-span-3 w-fit">
                                <p className="text-sm font-semibold text-white">No {emptyMessages.title} matches for your club</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {emptyMessages.your}
                                </p>
                            </div>
                        )}
                    </div>

                    {yourMatches.length > PAGE_SIZE && (
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                disabled={currentYourPage <= 1}
                                onClick={() => setYourPage((prev) => Math.max(1, prev - 1))}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <p className="text-sm text-gray-400">
                                Page <span className="text-white font-semibold">{currentYourPage}</span> of{" "}
                                <span className="text-white font-semibold">{yourTotalPages}</span>
                            </p>
                            <button
                                type="button"
                                disabled={currentYourPage >= yourTotalPages}
                                onClick={() => setYourPage((prev) => Math.min(yourTotalPages, prev + 1))}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold">Other Matches</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {status === 0 && "Upcoming games across other clubs."}
                        {status === 1 && "Live games across other clubs."}
                        {status === 2 && "Finished games across other clubs."}
                    </p>

                    <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {visibleOtherMatches.length > 0 ? (
                            visibleOtherMatches.map((match) => (
                                <MatchCard key={match.game_id} isMatchOurs={false} match={match} />
                            ))
                        ) : (
                            <div className="rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 sm:col-span-2 xl:col-span-3 w-fit">
                                <p className="text-sm font-semibold text-white">No other {emptyMessages.title} matches</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {emptyMessages.other}
                                </p>
                            </div>
                        )}
                    </div>

                    {otherMatches.length > PAGE_SIZE && (
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                disabled={currentOtherPage <= 1}
                                onClick={() => setOtherPage((prev) => Math.max(1, prev - 1))}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <p className="text-sm text-gray-400">
                                Page <span className="text-white font-semibold">{currentOtherPage}</span> of{" "}
                                <span className="text-white font-semibold">{otherTotalPages}</span>
                            </p>
                            <button
                                type="button"
                                disabled={currentOtherPage >= otherTotalPages}
                                onClick={() => setOtherPage((prev) => Math.min(otherTotalPages, prev + 1))}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default UserMatchesPage;
