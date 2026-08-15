"use client";

import { API_URL } from "@/lib/clientUtils";
import { useState } from "react";

const AdminDashboardPlayers = () => {
    const [limit, setLimit] = useState(10);
    const [position, setPosition] = useState("Select a position");
    const [minRating, setMinRating] = useState(30);
    const [maxRating, setMaxRating] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreate = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/players/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit, position: position.toUpperCase(), min_rating: minRating, max_rating: maxRating }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();

            if (!response.ok) {
                setError(result?.message ?? "Unable to create players.");
                return;
            }

            setSuccess(`Successfully created ${limit} player${limit === 1 ? "" : "s"}.`);
        } catch {
            setError("Unable to create players right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Player market</p>
                <h1 className="mt-1 text-3xl font-extrabold">Create Players</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Generate new players for the market so clubs can buy and build their squads.
                </p>

                <div className="mt-6 grid lg:grid-cols-3 gap-4">
                    <section className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">How many players?</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Enter a number and create them in one go.
                        </p>

                        <div className="mt-5 flex flex-col gap-3">
                            <div className="flex-1 flex flex-col gap-3">
                                <label className="text-sm text-gray-400 block" htmlFor="player-count">
                                    Number of players
                                </label>
                                <input
                                    id="player-count"
                                    type="number"
                                    min={1}
                                    onWheel={e => e.currentTarget.blur()}
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400"
                                    placeholder="e.g. 10"
                                />

                                <label className="text-sm text-gray-400 block" htmlFor="player-count">
                                    Position
                                </label>
                                <select
                                    id="position"
                                    required
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 cursor-pointer"
                                >
                                    <option value="Select a position" disabled>Select a position</option>
                                    <option value="Attacker">Attacker</option>
                                    <option value="Defender">Defender</option>
                                    <option value="Midfielder">Midfielder</option>
                                    <option value="Goalkeeper">Goalkeeper</option>
                                </select>

                                <label className="text-sm text-gray-400 block" htmlFor="player-count">
                                    Minimum Rating
                                </label>
                                <input
                                    id="rating"
                                    type="number"
                                    min={1}
                                    onWheel={e => e.currentTarget.blur()}
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400"
                                    placeholder="e.g. 10"
                                />

                                <label className="text-sm text-gray-400 block" htmlFor="player-count">
                                    Maximum Rating
                                </label>
                                <input
                                    id="rating"
                                    type="number"
                                    min={1}
                                    onWheel={e => e.currentTarget.blur()}
                                    value={maxRating}
                                    onChange={(e) => setMaxRating(Number(e.target.value))}
                                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400"
                                    placeholder="e.g. 10"
                                />
                            </div>
                            <button
                                type="button"
                                disabled={loading || !limit || limit < 1}
                                onClick={handleCreate}
                                className="cursor-pointer px-5 py-3 rounded-lg bg-green-600 text-white font-semibold whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : "Create"}
                            </button>
                        </div>

                        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                        {success && <p className="mt-3 text-sm text-green-500">{success}</p>}
                    </section>

                    <aside className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Quick tips</h2>
                        <ul className="mt-3 space-y-3 text-sm text-gray-400">
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Start small if you’re testing the market.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>Created players become available for clubs to buy.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-yellow-500 font-bold">•</span>
                                <span>You can generate more anytime the market runs low.</span>
                            </li>
                        </ul>
                    </aside>
                </div>

                <section className="mt-4 w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
                    <p className="text-sm font-semibold text-white">Need more later?</p>
                    <p className="text-sm text-gray-400">Come back here whenever clubs need fresh talent.</p>
                </section>
            </div>
        </main>
    )
}

export default AdminDashboardPlayers
