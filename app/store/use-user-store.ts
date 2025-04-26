import {create} from "zustand";

export interface UserStore{
    users: IUser[];
    user: IUser | undefined;
    currentUser?: IUser | undefined;
    setUsers: (users: IUser[]) => void;
    setUser: (user: IUser | undefined) => void;
    setCurrentUser: (user: IUser) => void;
    setState: (state: any) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [] as IUser[],
    user: undefined,
    currentUser: undefined,
    setUsers: (users) => set({users}),
    setUser: (user) => set({user}),
    setCurrentUser: (user) => set({currentUser: user}),
    setState: (state) => set({...state}),
}));