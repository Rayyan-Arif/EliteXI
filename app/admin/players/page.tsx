"use client";

import { API_URL } from "@/lib/helper";
import { useState } from "react";

const AdminDashboardPlayers = () => {
    const [limit, setLimit] = useState(10);
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
                body: JSON.stringify({ limit }),
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
        <main className="flex-1 px-6 py-8 overflow-auto">
            <div className="max-w-3xl">
                <p className="text-sm text-gray-400">Player market</p>
                <h1 className="mt-1 text-3xl font-extrabold">Create Players</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Generate new players for the market so clubs can buy and build their squads.
                </p>

                <div className="mt-6 grid md:grid-cols-5 gap-4">
                    <section className="md:col-span-3 bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">How many players?</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Enter a number and create them in one go.
                        </p>

                        <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-end">
                            <div className="flex-1">
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="player-count">
                                    Number of players
                                </label>
                                <input
                                    id="player-count"
                                    type="number"
                                    min={1}
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
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

                    <aside className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-5">
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

                <section className="mt-4 bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
                    <p className="text-sm font-semibold text-white">Need more later?</p>
                    <p className="text-sm text-gray-400">Come back here whenever clubs need fresh talent.</p>
                </section>
            </div>
        </main>
    )
}

export default AdminDashboardPlayers
