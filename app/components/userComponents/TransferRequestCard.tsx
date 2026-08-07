"use client";

import { formatDateTime, sendMessage } from "@/lib/clientUtils";
import { API_URL } from "@/lib/clientUtils";
import { TransferRequest } from "@/types/player";
import React, { useState } from "react";

const TransferRequestCard = ({
    request,
    clubId,
    variant,
    setIncoming,
    setMoney,
}: {
    request: TransferRequest;
    clubId: number;
    variant: "incoming" | "outgoing";
    setIncoming?: React.Dispatch<React.SetStateAction<TransferRequest[]>>;
    setMoney?: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

    const handleAction = async (action: "approve" | "reject") => {
        if (!clubId) {
            sendMessage(false, "Club not found.");
            return;
        }

        setLoading(action);

        try {
            const res = await fetch(`${API_URL}/players/transfer/${action}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    club1_id: request.requested_club_id,
                    club2_id: clubId,
                    player_id: request.player_id,
                    transfer_amount: request.transfer_amount,
                }),
                signal: AbortSignal.timeout(5000),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || data?.status !== "success") {
                sendMessage(false, data?.message ?? `Unable to ${action} transfer.`);
                return;
            }

            setIncoming?.((prev) =>
                prev.filter(
                    (r) =>
                        !(
                            r.player_id === request.player_id &&
                            r.requested_club_id === request.requested_club_id
                        )
                )
            );

            if (action === "approve") {
                setMoney?.((prev) => prev + Number(request.transfer_amount));
            }

            sendMessage(true, `Transfer ${action === "approve" ? "approved" : "rejected"}.`);
        } catch {
            sendMessage(false, `Unable to ${action} transfer right now. Try again.`);
        } finally {
            setLoading(null);
        }
    };

    const statusClass =
        request.transfer_status === "APPROVED"
            ? "bg-green-500/20 text-green-400"
            : request.transfer_status === "REJECTED"
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400";

    return (
        <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold">{request.player_name}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {variant === "incoming" ? "From" : "To"} {request.requested_club_name}
                    </p>
                </div>
                {variant === "outgoing" && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${statusClass}`}>
                        {request.transfer_status}
                    </span>
                )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="mt-1 font-semibold text-white">{request.transfer_amount} Coins</p>
                </div>
                <div>
                    <p className="text-gray-400">Requested at</p>
                    <p className="mt-1 font-semibold text-white">{formatDateTime(request.requested_at)}</p>
                </div>
            </div>

            {variant === "incoming" && (
                <div className="mt-5 pt-4 border-t border-gray-700 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        disabled={loading !== null}
                        onClick={() => handleAction("approve")}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50"
                    >
                        {loading === "approve" ? "Approving..." : "Approve"}
                    </button>
                    <button
                        type="button"
                        disabled={loading !== null}
                        onClick={() => handleAction("reject")}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
                    >
                        {loading === "reject" ? "Rejecting..." : "Reject"}
                    </button>
                </div>
            )}
        </article>
    );
};

export default TransferRequestCard;
