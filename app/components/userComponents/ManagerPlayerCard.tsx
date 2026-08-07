"use client";
import { formatDateTime, sendMessage } from '@/lib/clientUtils';
import { API_URL } from "@/lib/clientUtils";
import { ClubPlayer } from '@/types/player'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import ReleasePlayerConfirmation from './ReleasePlayerConfirmation';

const ManagerPlayerCard = ({player, isCaptain}: {player: ClubPlayer, isCaptain: boolean}) => {
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const makeCaptain = async() => {
        try{
            setLoading(true);

            const res = await fetch(`${API_URL}/players/captain`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({captain_id: player.player_id}),
                signal: AbortSignal.timeout(5000)
            });

            if(res.ok){
                const data = await res.json();

                if(data.status === 'success'){
                    router.refresh();
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
        <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col">

            {popup && <ReleasePlayerConfirmation setPopup={setPopup} loading={loading} setLoading={setLoading} player={player}/>}

            <div className="flex items-start justify-between gap-3">
                <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold">{player.name}</h2>
                    {isCaptain && 
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/20 bg-opacity-20 text-yellow-400">
                        Captain
                    </span>}
                </div>
                <p className="mt-1 text-sm text-gray-400">{player.position} · Age {player.age}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 bg-opacity-20 text-green-400">
                Rating {player.rating}
                </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                <p className="text-gray-400">Price</p>
                <p className="mt-1 font-semibold">{player.price} Coins</p>
                </div>
                <div>
                <p className="text-gray-400">Contract ends</p>
                <p className="mt-1 font-semibold">{formatDateTime(player.contract_end_date)}</p>
                </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-700 flex items-center justify-between gap-4">
                <button
                type="button"
                onClick={makeCaptain}
                disabled={loading}
                className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
                >
                {loading ? 'Processing...' : 'Make Captain'}
                </button>
                <button
                type="button"
                onClick={() => setPopup(true)}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
                >
                Release Player
                </button>
            </div>
        </article>
    )
}

export default ManagerPlayerCard