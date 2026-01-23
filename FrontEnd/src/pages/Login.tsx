// import axios from "axios"
import React, { useState } from "react"
import api from "../api/axios"

export function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isloading, setIsloading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        setIsloading(true)
        try{
            const res = await api.get<{token:string}>(
                "/users/",{
                    headers:{
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmVkMjBkMjhmZjViNzUwYTVkMmYwNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY5MDkzNTM5LCJleHAiOjE3NjkwOTM4Mzl9.ug_VjdD-4LXSgY9arHPfsQqAoCeMh4u1PDGVCRdxV10`
                    }
                }
            )
            // const res = await api.post<{token:string}>(
            //     "/auth/login",
            //     {email,password}
            // )
            console.log(res)
            alert("logged in")
        }catch{
            setError("messed up")
        }finally{
            setIsloading(false)
        }
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <label>email</label>
            <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
            <label>password</label>
            <input type="password" value={password} disabled={isloading} onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button type="submit">
                login
            </button>
            {error && <p>{error}</p>}
        </form>
        </>
    )
}