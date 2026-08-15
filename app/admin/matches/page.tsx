"use client";

import AdminUpcomingGame from "@/app/components/adminComponents/AdminUpcomingGame";
import { API_URL } from "@/lib/clientUtils";
import { ClubOption } from "@/types/club";
import { TournamentOption, UpcomingGame } from "@/types/games";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

const selectClass =
    "w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 cursor-pointer";
const inputClass =
    "w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-700 text-gray-50 placeholder-gray-400";
const buttonClass =
    "cursor-pointer px-5 py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed";

const AdminDashboardMatches = () => {
    const [searchClubs, setSearchClubs] = useState<ClubOption[]>([]);
    const [liveTournaments, setLiveTournaments] = useState<TournamentOption[]>([]);
    const [games, setGames] = useState<UpcomingGame[]>([]);
    const [page, setPage] = useState(1);

    const [gameName, setGameName] = useState("");
    const [club1Id, setClub1Id] = useState("");
    const [club2Id, setClub2Id] = useState("");
    const [club1Name, setClub1Name] = useState("");
    const [club2Name, setClub2Name] = useState("");
    const [winningPrice, setWinningPrice] = useState(1000);
    const [gameDate, setGameDate] = useState("");
    const [isTournamentMatch, setIsTournamentMatch] = useState(false);
    const [tournamentId, setTournamentId] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");

    const [search, setSearch] = useState("");

    const bothClubsSelected = Boolean(club1Id && club2Id);

    const totalPages = Math.max(1, Math.ceil(games.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const visibleGames = games.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const loadData = async () => {
        try {
            const [tournamentsRes, matchesRes] = await Promise.all([
                fetch(`${API_URL}/tournaments/live`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                }),
                fetch(`${API_URL}/matches?status=0`, {
                    credentials: "include",
                    signal: AbortSignal.timeout(5000),
                }),
            ]);

            if (tournamentsRes.ok) {
                const data = await tournamentsRes.json();
                if (data.status === "success") setLiveTournaments(data.data.tournaments ?? []);
            }

            if (matchesRes.ok) {
                const data = await matchesRes.json();
                if (data.status === "success") setGames(data.data.matches ?? []);
            }
        } catch {
            // keep existing UI state on fetch failure
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (bothClubsSelected) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${API_URL}/clubs/approved?search=${encodeURIComponent(search)}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                if (data.status === "success") {
                    setSearchClubs(data.data.clubs ?? []);
                }
            } catch {
                // ignore search failures
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, bothClubsSelected]);

    const handleAddClub = (club: ClubOption) => {
        const id = String(club.club_id);
        if (id === club1Id || id === club2Id) return;

        if (!club1Id) {
            setClub1Id(id);
            setClub1Name(club.name);
        } else if (!club2Id) {
            setClub2Id(id);
            setClub2Name(club.name);
            setSearch("");
            setSearchClubs([]);
        }
    };

    const handleRemoveClub = (slot: 1 | 2) => {
        if (slot === 1) {
            setClub1Id("");
            setClub1Name("");
        } else {
            setClub2Id("");
            setClub2Name("");
        }
    };

    const handleCreate = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateError("");
        setCreateSuccess("");

        if (!club1Id || !club2Id) {
            setCreateError("Please add two clubs to the match.");
            return;
        }

        if (club1Id === club2Id) {
            setCreateError("Club 1 and Club 2 must be different.");
            return;
        }

        if (isTournamentMatch && !tournamentId) {
            setCreateError("Please select a live tournament.");
            return;
        }

        setCreateLoading(true);

        try {
            const response = await fetch(`${API_URL}/matches/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    game_name: gameName,
                    club1_id: Number(club1Id),
                    club2_id: Number(club2Id),
                    game_date: gameDate,
                    winning_price: Number(winningPrice),
                    tournament_id: isTournamentMatch ? Number(tournamentId) : null,
                }),
                credentials: "include",
                signal: AbortSignal.timeout(5000),
            });
            const result = await response.json();

            if (!response.ok) {
                setCreateError(result?.message ?? "Unable to create match.");
                return;
            }

            setCreateSuccess("Match created successfully.");
            setGameName("");
            setClub1Id("");
            setClub2Id("");
            setClub1Name("");
            setClub2Name("");
            setWinningPrice(1000);
            setGameDate("");
            setIsTournamentMatch(false);
            setTournamentId("");
            setSearch("");
            setSearchClubs([]);
            await loadData();
        } catch {
            setCreateError("Unable to create match right now. Please try again.");
        } finally {
            setCreateLoading(false);
        }
    };

    //the club which has been selected for match addition does not come again while second club is being selected 
    const filteredSearchClubs = searchClubs.filter(
        (club) => String(club.club_id) !== club1Id && String(club.club_id) !== club2Id
    );

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
                <p className="text-sm text-gray-400">Fixtures</p>
                <h1 className="mt-1 text-3xl font-extrabold">Matches</h1>
                <p className="mt-2 text-sm text-gray-400">
                    Create new fixtures and cancel upcoming games when needed.
                </p>

                <div className="mt-6 grid lg:grid-cols-2 gap-4">
                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Create Match</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Schedule a game between two approved clubs.
                        </p>

                        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2" htmlFor="game-name">
                                    Game name
                                </label>
                                <input
                                    id="game-name"
                                    type="text"
                                    required
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Derby Night"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">Clubs</p>
                                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                    <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 flex items-center justify-between gap-2 min-h-[52px]">
                                        <div>
                                            <p className="text-xs text-gray-500">Club 1</p>
                                            <p className="text-sm font-semibold text-white mt-0.5">
                                                {club1Name || "Not selected"}
                                            </p>
                                        </div>
                                        {club1Id && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveClub(1)}
                                                className="cursor-pointer text-gray-400 hover:text-white"
                                                aria-label="Remove club 1"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 flex items-center justify-between gap-2 min-h-[52px]">
                                        <div>
                                            <p className="text-xs text-gray-500">Club 2</p>
                                            <p className="text-sm font-semibold text-white mt-0.5">
                                                {club2Name || "Not selected"}
                                            </p>
                                        </div>
                                        {club2Id && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveClub(2)}
                                                className="cursor-pointer text-gray-400 hover:text-white"
                                                aria-label="Remove club 2"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {!bothClubsSelected && (
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2" htmlFor="club-search">
                                            Search clubs
                                        </label>
                                        <input
                                            id="club-search"
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className={inputClass}
                                            placeholder="Type a club name..."
                                        />
                                        {search && (
                                            <div className="mt-2 max-h-48 overflow-auto space-y-2 rounded-lg border border-gray-700 bg-gray-900 p-2">
                                                {filteredSearchClubs.length > 0 ? (
                                                    filteredSearchClubs.map((club) => (
                                                        <div
                                                            key={club.club_id}
                                                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-800"
                                                        >
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {club.name}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddClub(club)}
                                                                className="cursor-pointer shrink-0 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold"
                                                            >
                                                                Add to match
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

                            <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2" htmlFor="winning-price">
                                        Winning price
                                    </label>
                                    <input
                                        id="winning-price"
                                        type="number"
                                        min={1}
                                        required
                                        onWheel={(e) => e.currentTarget.blur()}
                                        value={winningPrice}
                                        onChange={(e) => setWinningPrice(Number(e.target.value))}
                                        className={inputClass}
                                        placeholder="e.g. 1000"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2" htmlFor="game-date">
                                        Game date
                                    </label>
                                    <input
                                        id="game-date"
                                        type="datetime-local"
                                        required
                                        value={gameDate}
                                        onChange={(e) => setGameDate(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTournamentMatch}
                                    onChange={(e) => {
                                        setIsTournamentMatch(e.target.checked);
                                        if (!e.target.checked) setTournamentId("");
                                    }}
                                    className="cursor-pointer"
                                />
                                This game is part of a tournament
                            </label>

                            {isTournamentMatch && (
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2" htmlFor="tournament">
                                        Live tournament
                                    </label>
                                    <select
                                        id="tournament"
                                        required={isTournamentMatch}
                                        value={tournamentId}
                                        onChange={(e) => setTournamentId(e.target.value)}
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
                            )}

                            {createError && <p className="text-sm text-red-500">{createError}</p>}
                            {createSuccess && <p className="text-sm text-green-500">{createSuccess}</p>}

                            <button type="submit" disabled={createLoading} className={buttonClass}>
                                {createLoading ? "Creating..." : "Create Match"}
                            </button>
                        </form>
                    </section>

                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                        <h2 className="text-lg font-bold">Upcoming Games</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Cancel a scheduled game if it can no longer go ahead.
                        </p>

                        <div className="mt-4 space-y-3">
                            {games.length > 0 ? (
                                visibleGames.map((game) => (
                                    <AdminUpcomingGame
                                        key={game.game_id}
                                        game={game}
                                        club1Name={game.club1_name ?? `Club #${game.club1_id}`}
                                        club2Name={game.club2_name ?? `Club #${game.club2_id}`}
                                        setGames={setGames}
                                    />
                                ))
                            ) : (
                                <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3">
                                    <p className="text-sm font-semibold text-white">No upcoming games</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Newly created matches will appear here.
                                    </p>
                                </div>
                            )}
                        </div>

                        {games.length > PAGE_SIZE && (
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <p className="text-sm text-gray-400">
                                    Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
                                    <span className="text-white font-semibold">{totalPages}</span>
                                </p>
                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardMatches;
