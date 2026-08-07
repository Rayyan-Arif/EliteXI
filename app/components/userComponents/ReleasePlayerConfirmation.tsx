"use client";

import { sendMessage } from "@/lib/clientUtils";
import { API_URL } from "@/lib/clientUtils";
import { ClubPlayer } from "@/types/player";
import { useRouter } from "next/navigation";

const ReleasePlayerConfirmation = ({setPopup, loading, setLoading, player}: {player: ClubPlayer, setPopup: React.Dispatch<React.SetStateAction<boolean>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const router = useRouter();

    const releasePlayer = async() => {
        try{
            setLoading(true);

            const res = await fetch(`${API_URL}/players/release`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({player_id: player.player_id, club_id: player.club_id}),
                signal: AbortSignal.timeout(5000)
            });

            if(res.ok){
                const data = await res.json();

                if(data.status === 'success'){
                    router.refresh();
                    sendMessage(true, 'Player released!');
                } else {
                    sendMessage(false, data.message);
                }
            } else {
                sendMessage(false, "Operation failed. Try again");
            }
        } catch(err){
            sendMessage(false, "Operation failed. Try again");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    Confirm release
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-white">
                    Release this player?
                </h2>
                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Are you sure you want to release <span className="font-semibold text-gray-200">{player.name}</span>?
                    This will remove them from your club and cannot be undone from here.
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={releasePlayer}
                        className="cursor-pointer px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : "Yes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setPopup(false)}
                        className="cursor-pointer px-5 py-2.5 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReleasePlayerConfirmation;
