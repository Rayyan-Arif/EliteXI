"use client";
import { sendMessage } from '@/lib/clientUtils';
import { API_URL } from "@/lib/clientUtils";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const ClubDeletionButton = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const deleteClub = async() => {
        try{
            setLoading(true);

            const res = await fetch(`${API_URL}/clubs/delete`, {method: 'DELETE',credentials: 'include'});

            if(!res.ok){
                sendMessage(false, 'Operation failed. Try again later');
                return;
            }

            sendMessage(true, "Club deleted successfully.");   
            router.refresh();         
        } catch(err){
            console.log(err);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='w-full flex justify-center items-center'>
            <button 
                disabled={loading}
                onClick={deleteClub}
                className='m-8 cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50'>
                {loading ? 'Processing...' : 'Delete Club'}
            </button>
        </div>
    )
}

export default ClubDeletionButton