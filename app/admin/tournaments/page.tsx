"use client";

import { API_URL } from "@/lib/clientUtils";
import { ClubOption } from "@/types/club";
import { TournamentOption } from "@/types/games";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const selectClass =
    "w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 cursor-pointer";
const inputClass =
    "w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400";
const buttonClass =
    "cursor-pointer px-5 py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed";
const dangerButtonClass =
    "cursor-pointer px-5 py-3 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed";

const AdminDashboardTournaments = () => {
    const [liveTournaments, setLiveTournaments] = useState<TournamentOption[]>([]);

    const [createName, setCreateName] = useState("");
    const [createTeams, setCreateTeams] = useState(8);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    const [addTournamentId, setAddTournamentId] = useState("");
    const [addClubId, setAddClubId] = useState("");
    const [addClubName, setAddClubName] = useState("");
    const [addSearch, setAddSearch] = useState("");
    const [addSearchClubs, setAddSearchClubs] = useState<ClubOption[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");

    const [removeTournamentId, setRemoveTournamentId] = useState("");
    const [removeClubId, setRemoveClubId] = useState("");
    const [removeClubName, setRemoveClubName] = useState("");
    const [removeSearch, setRemoveSearch] = useState("");
    const [removeSearchClubs, setRemoveSearchClubs] = useState<ClubOption[]>([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [removeError, setRemoveError] = useState("");
    const [removeSuccess, setRemoveSuccess] = useState("");

    const loadData = async () => {
        try {
            const liveRes = await fetch(`${API_URL}/tournaments/live`, {
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });

            if (liveRes.ok) {
                const liveData = await liveRes.json();
                if (liveData.status === "success") {
                    setLiveTournaments(liveData.data.tournaments ?? []);
                }
            }
        } catch {
            // keep existing UI state on fetch failure
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (addClubId) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${API_URL}/clubs/approved?search=${encodeURIComponent(addSearch)}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                if (data.status === "success") {
                    setAddSearchClubs(data.data.clubs ?? []);
                }
            } catch {
                // ignore search failures
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [addSearch, addClubId]);

    useEffect(() => {
        if (removeClubId) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${API_URL}/clubs/approved?search=${encodeURIComponent(removeSearch)}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                if (data.status === "success") {
                    setRemoveSearchClubs(data.data.clubs ?? []);
                }
            } catch {
                // ignore search failures
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [removeSearch, removeClubId]);

    const handleCreate = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateError("");
        setCreateSuccess("");
        setCreateLoading(true);

        try {
            const response = await fetch(`${API_URL}/tournaments/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: createName, no_of_teams: createTeams }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();

            if (!response.ok) {
                setCreateError(result?.message ?? "Unable to create tournament.");
                return;
            }

            setCreateSuccess("Tournament created successfully.");
            setCreateName("");
            setCreateTeams(8);
            await loadData();
        } catch {
            setCreateError("Unable to create tournament right now. Please try again.");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleAddTeam = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAddError("");
        setAddSuccess("");

        if (!addClubId) {
            setAddError("Please select a club to add.");
            return;
        }

        setAddLoading(true);

        try {
            const response = await fetch(`${API_URL}/tournaments/add-team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tournament_id: Number(addTournamentId),
                    club_id: Number(addClubId),
                }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();

            if (!response.ok) {
                setAddError(result?.message ?? "Unable to add team.");
                return;
            }

            setAddSuccess("Team added to tournament.");
            setAddTournamentId("");
            setAddClubId("");
            setAddClubName("");
            setAddSearch("");
            setAddSearchClubs([]);
            await loadData();
        } catch {
            setAddError("Unable to add team right now. Please try again.");
        } finally {
            setAddLoading(false);
        }
    };

    const handleRemoveTeam = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRemoveError("");
        setRemoveSuccess("");

        if (!removeClubId) {
            setRemoveError("Please select a club to remove.");
            return;
        }

        setRemoveLoading(true);

        try {
            const response = await fetch(`${API_URL}/tournaments/remove-team`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tournament_id: Number(removeTournamentId),
                    club_id: Number(removeClubId),
                }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok && response.status !== 204) {
                const result = await response.json().catch(() => null);
                setRemoveError(result?.message ?? "Unable to remove team.");
                return;
            }

            setRemoveSuccess("Team removed from tournament.");
            setRemoveTournamentId("");
            setRemoveClubId("");
            setRemoveClubName("");
            setRemoveSearch("");
            setRemoveSearchClubs([]);
            await loadData();
        } catch {
            setRemoveError("Unable to remove team right now. Please try again.");
        } finally {
            setRemoveLoading(false);
        }
    };

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Competitions</p>
                <h1 className="mt-1 text-3xl font-extrabold">Tournaments</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Create tournaments, review live ones, and manage participating clubs.
                </p>

                <div className="mt-6 grid lg:grid-cols-2 gap-4">
                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Create Tournament</h2>
                        <p className="mt-1 text-sm text-gray-400">Set a name and how many teams can join.</p>

                        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="tournament-name">
                                    Tournament name
                                </label>
                                <input
                                    id="tournament-name"
                                    type="text"
                                    required
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Spring Cup"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="no-of-teams">
                                    Number of teams
                                </label>
                                <input
                                    id="no-of-teams"
                                    type="number"
                                    min={2}
                                    required
                                    onWheel={(e) => e.currentTarget.blur()}
                                    value={createTeams}
                                    onChange={(e) => setCreateTeams(Number(e.target.value))}
                                    className={inputClass}
                                    placeholder="e.g. 8"
                                />
                            </div>
                            {createError && <p className="text-sm text-red-500">{createError}</p>}
                            {createSuccess && <p className="text-sm text-green-500">{createSuccess}</p>}
                            <button type="submit" disabled={createLoading} className={buttonClass}>
                                {createLoading ? "Creating..." : "Create Tournament"}
                            </button>
                        </form>
                    </section>

                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Live Tournaments</h2>
                        <p className="mt-1 text-sm text-gray-400">Tournaments with upcoming games.</p>

                        <div className="mt-4 space-y-2 max-h-72 overflow-auto">
                            {liveTournaments.length > 0 ? (
                                liveTournaments.map((tournament) => (
                                    <article
                                        key={tournament.tournament_id}
                                        className="rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 flex items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="font-semibold">{tournament.name}</p>
                                            <p className="text-sm text-gray-400 mt-0.5">
                                                Teams allowed: {tournament.no_of_teams}
                                            </p>
                                        </div>
                                        <span className="text-xs text-green-500 font-semibold">Live</span>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3">
                                    <p className="text-sm font-semibold text-white">No live tournaments</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Create a tournament and schedule games to see them here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Add Team</h2>
                        <p className="mt-1 text-sm text-gray-400">Add an approved club to a tournament.</p>

                        <form className="mt-4 space-y-3" onSubmit={handleAddTeam}>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="add-tournament">
                                    Tournament
                                </label>
                                <select
                                    id="add-tournament"
                                    required
                                    value={addTournamentId}
                                    onChange={(e) => setAddTournamentId(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="">Select tournament</option>
                                    {liveTournaments.map((tournament) => (
                                        <option key={tournament.tournament_id} value={tournament.tournament_id}>
                                            {tournament.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">Club</p>
                                {addClubId ? (
                                    <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-white">{addClubName}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAddClubId("");
                                                setAddClubName("");
                                            }}
                                            className="cursor-pointer text-gray-400 hover:text-white"
                                            aria-label="Clear selected club"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="sr-only" htmlFor="add-club-search">
                                            Search clubs
                                        </label>
                                        <input
                                            id="add-club-search"
                                            type="text"
                                            value={addSearch}
                                            onChange={(e) => setAddSearch(e.target.value)}
                                            className={inputClass}
                                            placeholder="Search club to add..."
                                        />
                                        {addSearch && (
                                            <div className="mt-2 max-h-48 overflow-auto space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-2">
                                                {addSearchClubs.length > 0 ? (
                                                    addSearchClubs.map((club) => (
                                                        <div
                                                            key={club.club_id}
                                                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-800"
                                                        >
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {club.name}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setAddClubId(String(club.club_id));
                                                                    setAddClubName(club.name);
                                                                    setAddSearch("");
                                                                    setAddSearchClubs([]);
                                                                }}
                                                                className="cursor-pointer shrink-0 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold"
                                                            >
                                                                Add club
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400 px-2 py-1">
                                                        No clubs found.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {addError && <p className="text-sm text-red-500">{addError}</p>}
                            {addSuccess && <p className="text-sm text-green-500">{addSuccess}</p>}
                            <button type="submit" disabled={addLoading} className={buttonClass}>
                                {addLoading ? "Adding..." : "Add Team"}
                            </button>
                        </form>
                    </section>

                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Remove Team</h2>
                        <p className="mt-1 text-sm text-gray-400">Remove a club from a tournament.</p>

                        <form className="mt-4 space-y-3" onSubmit={handleRemoveTeam}>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="remove-tournament">
                                    Tournament
                                </label>
                                <select
                                    id="remove-tournament"
                                    required
                                    value={removeTournamentId}
                                    onChange={(e) => setRemoveTournamentId(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="">Select tournament</option>
                                    {liveTournaments.map((tournament) => (
                                        <option key={tournament.tournament_id} value={tournament.tournament_id}>
                                            {tournament.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">Club</p>
                                {removeClubId ? (
                                    <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-white">{removeClubName}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRemoveClubId("");
                                                setRemoveClubName("");
                                            }}
                                            className="cursor-pointer text-gray-400 hover:text-white"
                                            aria-label="Clear selected club"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="sr-only" htmlFor="remove-club-search">
                                            Search clubs
                                        </label>
                                        <input
                                            id="remove-club-search"
                                            type="text"
                                            value={removeSearch}
                                            onChange={(e) => setRemoveSearch(e.target.value)}
                                            className={inputClass}
                                            placeholder="Search club to remove..."
                                        />
                                        {removeSearch && (
                                            <div className="mt-2 max-h-48 overflow-auto space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-2">
                                                {removeSearchClubs.length > 0 ? (
                                                    removeSearchClubs.map((club) => (
                                                        <div
                                                            key={club.club_id}
                                                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-800"
                                                        >
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {club.name}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRemoveClubId(String(club.club_id));
                                                                    setRemoveClubName(club.name);
                                                                    setRemoveSearch("");
                                                                    setRemoveSearchClubs([]);
                                                                }}
                                                                className="cursor-pointer shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
                                                            >
                                                                Select club
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400 px-2 py-1">
                                                        No clubs found.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {removeError && <p className="text-sm text-red-500">{removeError}</p>}
                            {removeSuccess && <p className="text-sm text-green-500">{removeSuccess}</p>}
                            <button type="submit" disabled={removeLoading} className={dangerButtonClass}>
                                {removeLoading ? "Removing..." : "Remove Team"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardTournaments;
