import ManagerPlayerCard from '@/app/components/userComponents/ManagerPlayerCard';
import { getClubDetails } from '@/lib/user'
import { ManagerClub } from '@/types/club';
import { ClubPlayer } from '@/types/player';
import React from 'react'

const UserManagePlayerPage = async () => {
    const club: ManagerClub = await getClubDetails();

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
            <p className="text-sm text-gray-400">Your squad</p>
            <h1 className="mt-1 text-3xl font-extrabold">Club Players</h1>
            <p className="mt-2 text-sm text-gray-400">
                Manage your squad — make a captain or release a player when needed.
            </p>

            {
                club.players.length > 0 ?
                <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {
                        club.players.map((player: ClubPlayer) => <ManagerPlayerCard key={player.player_id} player={player} isCaptain={player.player_id === club.captain_id}/>)
                    }
                </div> : 
                <p className='text-2xl rounded-xl w-full text-center p-4 mt-4 bg-gray-500/20'>No players yet. Buy players from the market.</p>
            }
            </div>
        </main>
    )
}

export default UserManagePlayerPage