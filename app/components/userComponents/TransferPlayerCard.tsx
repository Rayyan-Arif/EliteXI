"use client";

import { formatDateTime, sendMessage } from "@/lib/clientUtils";
import { API_URL } from "@/lib/clientUtils";
import { TransferablePlayer } from "@/types/player";
import React, { useState } from "react";

const TransferPlayerCard = ({
    player,
    clubId,
    setPlayers,
}: {
    player: TransferablePlayer;
    clubId: number;
    setPlayers: React.Dispatch<React.SetStateAction<TransferablePlayer[]>>;
}) => {
    const [popup, setPopup] = useState(false);
    const [amount, setAmount] = useState(String(player.price));
    const [loading, setLoading] = useState(false);

    const requestTransfer = async () => {
        const transferAmount = Number(amount);

        if (!clubId) {
            sendMessage(false, "Club not found.");
            return;
        }

        if (!transferAmount || transferAmount <= 0) {
            sendMessage(false, "Please enter a valid transfer amount.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/players/transfer/request`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    club1_id: clubId,
                    club2_id: player.club_id,
                    player_id: player.player_id,
                    transfer_amount: transferAmount,
                }),
                signal: AbortSignal.timeout(5000),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.status !== "success") {
                sendMessage(false, data?.message ?? "Unable to request transfer.");
                return;
            }

            setPlayers((prev) => prev.filter((p) => p.player_id !== player.player_id));
            sendMessage(true, `Transfer requested for ${player.player_name}.`);
            setPopup(false);
        } catch {
            sendMessage(false, "Unable to request transfer right now. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col">
            {popup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-400">
                            Request transfer
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold text-white">
                            Transfer {player.player_name}?
                        </h2>
                        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                            Offer an amount to {player.club_name} for this player.
                        </p>

                        <div className="mt-5">
                            <label className="text-sm text-gray-400 block mb-2" htmlFor={`transfer-amount-${player.player_id}`}>
                                Transfer amount
                            </label>
                            <input
                                id={`transfer-amount-${player.player_id}`}
                                type="number"
                                min={1}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setPopup(false)}
                                className="cursor-pointer px-5 py-2.5 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={requestTransfer}
                                className="cursor-pointer px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Requesting..." : "Confirm Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold">{player.player_name}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {player.position} · Age {player.age}
                    </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
                    Rating {player.rating}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400">Club</p>
                    <p className="mt-1 font-semibold text-white">{player.club_name}</p>
                </div>
                <div>
                    <p className="text-gray-400">Price</p>
                    <p className="mt-1 font-semibold text-white">{player.price} Coins</p>
                </div>
                <div>
                    <p className="text-gray-400">Contract ends</p>
                    <p className="mt-1 font-semibold text-white">{formatDateTime(player.contract_end_date)}</p>
                </div>
                <div>
                    <p className="text-gray-400">Position</p>
                    <p className="mt-1 font-semibold text-white">{player.position}</p>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setPopup(true)}
                className="cursor-pointer mt-5 w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold"
            >
                Request Transfer
            </button>
        </article>
    );
};

export default TransferPlayerCard;
