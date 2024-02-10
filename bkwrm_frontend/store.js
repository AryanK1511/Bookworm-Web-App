import { atom } from "jotai";

// Create an atom for user auth tracking
export const userAtom = atom({
	isAuthenticated: false,
	user: null,
});
