import React from 'react'
import UserNavbar from '../components/userComponents/UserNavbar'
import { API_URL } from "@/lib/clientUtils";
import { getClubDetails } from '@/lib/user';
import { ManagerClub } from '@/types/club';

const UserDashboardLayout = async ({children}: {children: React.ReactNode}) => {
    const club: ManagerClub = await getClubDetails();

    return (
        <div className="min-h-screen flex w-full">
            <UserNavbar clubStatus={club?.club_approved === 'APPROVED'}/>
            <div className="flex-1 min-w-0 pb-20 lg:pb-0">
                {children}
            </div>
        </div>
    )
}

export default UserDashboardLayout