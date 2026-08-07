"use client";
import BuyPlayersCard from '@/app/components/userComponents/BuyPlayersCard'
import { API_URL } from "@/lib/clientUtils";
import { BuyablePlayer } from '@/types/player';
import React, { useEffect, useState } from 'react'

const UserBuyPlayersPage = () => {
    const [players, setPlayers] = useState<BuyablePlayer[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [url, setUrl] = useState<string>(`${API_URL}/players/buyable?page=1`);
    const [position, setPosition] = useState("All");
    const [money, setMoney] = useState(0);
    const [clubId, setClubId] = useState(0);

    const getBuyablePlayers = async() => {
        try{
            const res = await fetch(url, {credentials: 'include'});

            if(!res.ok) return;

            const data = await res.json();

            if(data?.status !== 'success') return;

            setPlayers(data.data.players);
            setTotalPages(Math.ceil(data.data.total_players / 10));
            setMoney(data.data.money_left);
            setClubId(data.data.club_id ?? 0);
        } catch(err){
            console.log(err);
        }
    }
    
    useEffect(() => {
        getBuyablePlayers();
    }, [url]);

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className='flex flex-col md:flex-row w-full items-center justify-between'>
                <div className='flex flex-col'>
                    <p className="text-sm text-gray-400">Player market</p>
                    <h1 className="mt-1 text-3xl font-extrabold">Buy Players</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Browse available players and strengthen your squad.
                    </p>
                </div>
                <p className='mt-2 inline-block text-xl rounded-xl bg-gray-500/20 p-4'>Money Left: {money} Coins</p>
            </div>

            <div className="w-full max-w-full">

            <div className="mt-5 flex flex-wrap gap-2">
                {
                    ['All', 'Attacker', 'MidFielder', 'GoalKeeper', 'Defender'].map((pos, i) => 
                    <button 
                        key={i}
                        type="button"
                        onClick={() => {
                            if(pos === 'All')
                                setUrl(prev => prev.replace(`position=${position.toUpperCase()}`,''));
                            else{
                                if(url.includes('position'))
                                    setUrl(prev => prev.replace(`position=${position.toUpperCase()}`,`position=${pos.toUpperCase()}`));
                                else
                                    setUrl(url + `&position=${pos.toUpperCase()}`);
                            }

                            setPosition(pos);
                            setPage(1);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold ${pos === position ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
                    >
                        {pos}
                    </button>)
                }
            </div>

            <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                    players.map((player) => (
                        <BuyPlayersCard
                            key={player.player_id}
                            player={player}
                            clubId={clubId}
                            setMoney={setMoney}
                            setPlayers={setPlayers}
                        />
                    ))
                }
            </div>

            <div className="mt-6 flex items-center gap-10 w-full justify-center">
                {
                    page > 1 &&
                    <button
                        type="button"
                        onClick={() => {
                            setUrl(prev => prev.replace(`page=${page}`, `page=${page-1}`));
                            setPage(prev => prev - 1)
                        }}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700"
                    >
                        Previous
                    </button>
                }
                <p className="text-sm text-gray-400">
                    Page <span className="text-white font-semibold">{page}</span> of{" "}
                    <span className="text-white font-semibold">{totalPages}</span>
                </p>
                {
                    page < totalPages &&
                    <button
                        type="button"
                        onClick={() => {
                            setUrl(prev => prev.replace(`page=${page}`, `page=${page+1}`));
                            setPage(prev => prev + 1)
                        }}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700"
                    >
                        Next
                    </button>
                }
            </div>
            </div>
        </main>
    )
}

export default UserBuyPlayersPage
