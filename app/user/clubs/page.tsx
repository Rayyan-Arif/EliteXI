import ClubCreationForm from '@/app/components/userComponents/ClubCreationForm'
import ClubDeletionButton from '@/app/components/userComponents/ClubDeletionButton';
import { formatDateTime } from '@/lib/clientUtils';
import { ClubContext } from '@/lib/contexts';
import { getClubDetails } from '@/lib/user';
import { ManagerClub } from '@/types/club';
import React, { useContext } from 'react'

const UserClubsPage = async () => {
    const club: ManagerClub = await getClubDetails();

    return (
        <main className="flex-1 w-full px-6 py-8 overflow-auto">
            <div className="w-full max-w-full">
            <p className="text-sm text-gray-400">Your club</p>
            <h1 className="mt-1 text-3xl font-extrabold">Clubs</h1>
            
            {!club?.club_id && <ClubCreationForm/>}

            {
                club?.club_id && 
                <div className="mt-6 w-full gap-4">
                    <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-lg font-bold">Club Details</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        A quick look at your current club.
                    </p>

                    <div className="mt-4 rounded-xl bg-gray-900 border border-gray-700 p-5">
                        <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Club name</p>
                            <h3 className="mt-1 text-2xl font-bold">{club.name}</h3>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${club.club_approved === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {club.club_approved}
                        </span>
                        </div>

                        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Reputation</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.reputation}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Ranking</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.ranking ?? 'To be decided'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Wins</p>
                            <p className="mt-1 font-semibold text-green-400">{club.wins}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Draws</p>
                            <p className="mt-1 font-semibold text-yellow-400">{club.draws}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Losses</p>
                            <p className="mt-1 font-semibold text-red-400">{club.losses}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Trophies won</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.trophies_won}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">No. of players</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.no_of_players}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Money left</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.money_left} Coins</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Formation</p>
                            <p className="mt-1 font-semibold text-gray-100">{club.formation}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Created at</p>
                            <p className="mt-1 font-semibold text-gray-100">{formatDateTime(club.created_at)}</p>
                        </div>
                        </div>
                    </div>
                    </section>
                    
                    <ClubDeletionButton />
                </div>
            }

            </div>
        </main>
    )
}

export default UserClubsPage