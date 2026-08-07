"use client";

import TransferPlayerCard from "@/app/components/userComponents/TransferPlayerCard";
import TransferRequestCard from "@/app/components/userComponents/TransferRequestCard";
import { API_URL } from "@/lib/clientUtils";
import { TransferablePlayer, TransferRequest } from "@/types/player";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 9;

const UserTransfersPage = () => {
    const [clubId, setClubId] = useState(0);
    const [money, setMoney] = useState(0);
    const [players, setPlayers] = useState<TransferablePlayer[]>([]);
    const [incoming, setIncoming] = useState<TransferRequest[]>([]);
    const [outgoing, setOutgoing] = useState<TransferRequest[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [position, setPosition] = useState("All");

    const getTransferablePlayers = async (id: number, currentPage: number, currentPosition: string) => {
        try {
            let url = `${API_URL}/players/transferable/${id}?page=${currentPage}`;
            if (currentPosition !== "All") {
                url += `&position=${currentPosition.toUpperCase()}`;
            }

            const res = await fetch(url, { credentials: "include" });

            if (!res.ok) return;

            const data = await res.json();
            if (data?.status !== "success") return;

            setPlayers(data.data.players.transferable_players ?? []);
            setTotalPages(Math.max(1, Math.ceil((data.data.players.transferable_count ?? 0) / PAGE_SIZE)));
        } catch (err) {
            console.log(err);
        }
    };

    const getTransferRequests = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/players/transfer/${id}`, {
                credentials: "include",
            });

            if (!res.ok) return;

            const data = await res.json();
            if (data?.status !== "success") return;

            setIncoming(data.data.requests.requested_to_you ?? []);
            setOutgoing(data.data.requests.requested_by_you ?? []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const loadClub = async () => {
            try {
                const res = await fetch(`${API_URL}/clubs`, { credentials: "include" });
                if (!res.ok) return;

                const data = await res.json();
                if (data?.status !== "success") return;

                const id = data.data?.club?.club_id ?? 0;
                if (!id) return;

                setClubId(id);
                setMoney(data.data?.club?.money_left ?? 0);
                getTransferRequests(id);
            } catch (err) {
                console.log(err);
            }
        };

        loadClub();
    }, []);

    useEffect(() => {
        if (!clubId) return;
        getTransferablePlayers(clubId, page, position);
    }, [clubId, page, position]);

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <div className="flex flex-col md:flex-row w-full items-center justify-between">
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">Transfer market</p>
                        <h1 className="mt-1 text-3xl font-extrabold">Transfers</h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Browse players, handle incoming offers, and track your requests.
                        </p>
                    </div>
                    <p className="mt-2 inline-block text-xl rounded-xl bg-gray-500/20 p-4">
                        Money Left: {money} Coins
                    </p>
                </div>

                <section className="mt-8">
                    <h2 className="text-xl font-bold">Transferable Players</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Players available from other clubs.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {["All", "Attacker", "MidFielder", "GoalKeeper", "Defender"].map((pos, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setPosition(pos);
                                    setPage(1);
                                }}
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold ${pos === position ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 border border-gray-700"}`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {players.length > 0 ? (
                            players.map((player) => (
                                <TransferPlayerCard
                                    key={player.player_id}
                                    player={player}
                                    clubId={clubId}
                                    setPlayers={setPlayers}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 col-span-full">
                                No transferable players found.
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center gap-10 w-full justify-center">
                        {page > 1 && (
                            <button
                                type="button"
                                onClick={() => setPage((prev) => prev - 1)}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700"
                            >
                                Previous
                            </button>
                        )}
                        <p className="text-sm text-gray-400">
                            Page <span className="text-white font-semibold">{page}</span> of{" "}
                            <span className="text-white font-semibold">{totalPages}</span>
                        </p>
                        {page < totalPages && (
                            <button
                                type="button"
                                onClick={() => setPage((prev) => prev + 1)}
                                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold">Pending Requests</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Transfer requests sent to your club.
                    </p>

                    <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {incoming.length > 0 ? (
                            incoming.map((request) => (
                                <TransferRequestCard
                                    key={`${request.requested_club_id}-${request.player_id}`}
                                    request={request}
                                    clubId={clubId}
                                    variant="incoming"
                                    setIncoming={setIncoming}
                                    setMoney={setMoney}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 col-span-full">
                                No pending transfer requests.
                            </p>
                        )}
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold">Your Recent Requests</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Latest approved and rejected requests you made.
                    </p>

                    <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {outgoing.length > 0 ? (
                            outgoing.map((request) => (
                                <TransferRequestCard
                                    key={`${request.requested_club_id}-${request.player_id}-${request.transfer_status}`}
                                    request={request}
                                    clubId={clubId}
                                    variant="outgoing"
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 col-span-full">
                                No approved or rejected requests yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default UserTransfersPage;
