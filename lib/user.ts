import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCurrentUser = async(): Promise<User | null> => {
    try{
        const cookieHeader = (await cookies()).toString();

        const response = await fetch(`${API_URL}/users/me`, {
            credentials: 'include',
            next: {
                revalidate: 60
            },
            headers: {
                Cookie: cookieHeader
            }
        });
        const result = await response.json();

        if(!response.ok)
            return null;

        return result?.data ?? null;
    } catch(err){
        console.log(err);

        return null;
    }
};