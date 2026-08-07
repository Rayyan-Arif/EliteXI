"use client";

import { formatDateTime } from "@/lib/clientUtils";
import { API_URL } from "@/lib/clientUtils";
import { UpcomingGame } from "@/types/games";
import { useState } from "react";

const AdminUpcomingGame = ({
    game,
    club1Name,
    club2Name,
    setGames,
}: {
    game: UpcomingGame;
    club1Name: string;
    club2Name: string;
    setGames: React.Dispatch<React.SetStateAction<UpcomingGame[]>>;
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCancel = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/matches/cancel`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game_id: game.game_id }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok && response.status !== 204) {
                const result = await response.json().catch(() => null);
                setError(result?.message ?? "Unable to cancel game.");
                return;
            }

            setGames((prev) => prev.filter((g) => g.game_id !== game.game_id));
        } catch {
            setError("Unable to cancel game right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h3 className="text-lg font-bold">{game.game_name}</h3>
                <p className="mt-1 text-sm text-gray-300">
                    {club1Name} <span className="text-gray-500">vs</span> {club2Name}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                    Date: <span className="text-gray-200">{formatDateTime(game.game_date)}</span>
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    Winning price: <span className="text-gray-200">{game.winning_price}</span>
                </p>
                {game.tournament_id != null && (
                    <p className="mt-1 text-xs text-blue-400 font-semibold">Tournament match</p>
                )}
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
            <button
                type="button"
                disabled={loading}
                onClick={handleCancel}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
                {loading ? "Cancelling..." : "Cancel"}
            </button>
        </article>
    );
};

export default AdminUpcomingGame;
