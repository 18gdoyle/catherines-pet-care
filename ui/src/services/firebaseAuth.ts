import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export async function signOutGoogleUser() {
    const auth = getAuth();
    return signOut(auth).then(() => {
        return true;
    }).catch((error) => {
        throw error;
    });
}

export async function signInGoogleUser() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
    .then((result) => {
        return result
    }).catch((error) => {
        throw error;
    });
}