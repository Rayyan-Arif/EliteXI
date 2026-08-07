"use client";
import { BuyablePlayer } from '@/types/player';
import React, { useState } from 'react'
import BuyPlayerPopUp from './BuyPlayerPopUp';

const BuyPlayersCard = ({
    player,
    clubId,
    setMoney,
    setPlayers,
}: {
    player: BuyablePlayer;
    clubId: number;
    setMoney: React.Dispatch<React.SetStateAction<number>>;
    setPlayers: React.Dispatch<React.SetStateAction<BuyablePlayer[]>>;
}) => {
    const [popup, setPopup] = useState(false);

    return (
        <article className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col">
            {popup && (
                <BuyPlayerPopUp
                    player={player}
                    clubId={clubId}
                    setPopup={setPopup}
                    setMoney={setMoney}
                    setPlayers={setPlayers}
                />
            )}

            <div className="flex items-start justify-between gap-3">
                <div>
                <h2 className="text-lg font-bold">{player.name}</h2>
                <p className="mt-1 text-sm text-gray-400">{player.position} · Age {player.age}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 bg-opacity-20 text-green-400">
                Rating {player.rating}
                </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                <p className="text-gray-400">Price</p>
                <p className="mt-1 font-semibold text-white">{player.price}</p>
                </div>
                <div>
                <p className="text-gray-400">Position</p>
                <p className="mt-1 font-semibold text-white">{player.position}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setPopup(true)}
                className="cursor-pointer mt-5 w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold"
            >
                Buy Player
            </button>
        </article>
    )
}

export default BuyPlayersCard
