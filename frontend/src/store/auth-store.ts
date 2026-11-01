import {create} from 'zustand'
import type {User} from "../types/user.ts";

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;

    setAuth: (user: User, accessToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    clearAuth: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isLoading: true,

    setAuth: (user, accessToken) => set({user, accessToken}),
    setAccessToken: (accessToken) => set({accessToken}),
    clearAuth: () => set({user:null, accessToken:null}),
    setIsLoading: (isLoading) => set({isLoading}),
}))