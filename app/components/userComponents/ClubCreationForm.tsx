"use client";

import { API_URL } from "@/lib/clientUtils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ClubCreationForm = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [formation, setFormation] = useState("4-4-2");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCreate = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/clubs/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, formation }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();

            if (!response.ok) {
                setError(result?.message ?? "Unable to create club.");
                return;
            }

            setSuccess("Club created successfully.");
            setName("");
            setFormation("4-4-2");
            router.refresh();
        } catch {
            setError("Unable to create club right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5 mt-4">
            <h2 className="text-lg font-bold">Create Club</h2>
            <p className="mt-1 text-sm text-gray-400">
                Choose a name and formation to get started.
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleCreate}>
                <div>
                <label className="text-sm text-gray-400 block mb-2" htmlFor="club-name">
                    Club name
                </label>
                <input
                    id="club-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400"
                    placeholder="e.g. Northern United"
                />
                </div>

                <div>
                <label className="text-sm text-gray-400 block mb-2" htmlFor="formation">
                    Formation
                </label>
                <select
                    id="formation"
                    required
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 cursor-pointer"
                >
                    <option value="4-4-2">4-4-2</option>
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-3-2-1">4-3-2-1</option>
                    <option value="4-1-2-1-2">4-1-2-1-2</option>
                    <option value="4-3-1-2">4-3-1-2</option>
                </select>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}

                <button
                type="submit"
                disabled={loading}
                className="cursor-pointer px-5 py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {loading ? "Creating..." : "Create Club"}
                </button>
            </form>
        </section>
    )
}

export default ClubCreationForm
