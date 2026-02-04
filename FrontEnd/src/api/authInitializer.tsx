import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { setupInterceptors } from "./setupInterceptros";

export function AuthInitializer(){
    const auth = useAuth()

    useEffect(()=>{
        setupInterceptors(auth)
    },[auth])

    return null 
}