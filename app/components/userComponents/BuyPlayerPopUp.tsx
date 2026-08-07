"use client";

import { sendMessage } from "@/lib/clientUtils";
import { API_URL } from "@/lib/clientUtils";
import { BuyablePlayer } from "@/types/player";
import React, { useState } from "react";

const BuyPlayerPopUp = ({
    player,
    clubId,
    setPopup,
    setMoney,
    setPlayers,
}: {
    player: BuyablePlayer;
    clubId: number;
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setMoney: React.Dispatch<React.SetStateAction<number>>;
    setPlayers: React.Dispatch<React.SetStateAction<BuyablePlayer[]>>;
}) => {
    const [contractEndDate, setContractEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirmBuy = async () => {
        if (!clubId) {
            sendMessage(false, "Club not found.");
            return;
        }

        if (!contractEndDate) {
            sendMessage(false, "Please select a contract end date.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/players/buy`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    club_id: clubId,
                    player_id: player.player_id,
                    player_price: player.price,
                    contract_end_date: new Date(contractEndDate).toISOString(),
                }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json().catch(() => null);

            if (!response.ok) {
                sendMessage(false, result?.message ?? "Unable to buy player.");
                return;
            }

            setPlayers((prev) => prev.filter((p) => p.player_id !== player.player_id));
            setMoney((prev) => prev - player.price);
            sendMessage(true, `${player.name} bought successfully.`);
            setPopup(false);
        } catch {
            sendMessage(false, "Unable to buy player right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-400">
                    Confirm purchase
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">
                    Buy {player.name}?
                </h2>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Set a contract end date to complete this purchase for{" "}
                    <span className="font-semibold text-gray-200">{player.price} coins</span>.
                </p>

                <div className="mt-5">
                    <label className="text-sm text-gray-400 block mb-2" htmlFor="contract-end-date">
                        Contract end date
                    </label>
                    <input
                        id="contract-end-date"
                        type="date"
                        required
                        value={contractEndDate}
                        onChange={(e) => setContractEndDate(e.target.value)}
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
                        onClick={handleConfirmBuy}
                        className="cursor-pointer px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Buying..." : "Confirm Buy"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyPlayerPopUp;
