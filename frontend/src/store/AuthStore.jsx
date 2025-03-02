// Store to the JWT Tokens: id, access, refresh

import { create } from "zustand";

const intialState = {
    idToken:"",
    accessToken:"",
    refreshToken:""
};
const useAuthStore = create((set,get)=>({
    ...intialState,
    resetAuthStore:()=>{
        set(intialState)
    },

    setIDToken:(token)=>{
        set({idToken: token})
    },

    setAccessToken:(token)=>{
        set({accessToken: token})
    },

    setRefreshToken:(token)=>{
        set({refreshToken:token})
    }


}))

export default useAuthStore;