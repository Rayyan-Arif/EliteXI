"use client";

import { User } from "@/types/user";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({initialUser, children}: {initialUser: User | null, children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(initialUser);
    
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;