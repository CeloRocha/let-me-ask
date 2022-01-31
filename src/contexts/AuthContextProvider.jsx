import { useState, useEffect, createContext} from 'react'

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../services/firebase';

export const AuthContext = createContext({});

export function AuthContextProvider(props){

    const [user, setUser] = useState()

    function handleUser(user){
        if(user){
            const { email, displayName, photoURL, uid} = user

        if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account');
        }

        setUser({
            id: uid,
            email: email,
            name: displayName,
            avatar: String(photoURL)
        })
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => handleUser(user))

        return ()=>{unsubscribe()}
    }, [])

    async function signInWithGoogle () {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        handleUser(result.user)
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
    }
    return(
        <AuthContext.Provider value={{user, signInWithGoogle}} >
            {props.children}
        </AuthContext.Provider>
    )
}