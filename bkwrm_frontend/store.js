import { atom } from 'jotai';

// Create an atom for user auth tracking
export const userAtom = atom({
    isAuthenticated: false,
    user: null
});

// Create an atom for tracking user reviews
export const bookDetailsAtom = atom({});
export const reviewsAtom = atom([]);