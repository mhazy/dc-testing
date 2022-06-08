import { createContext } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    subscriptions: string[];
}

interface UserContextData {
    user: User | null,
}

export const UserContext = createContext<UserContextData>({ user: null });

export const UserContextProvider = UserContext.Provider;
