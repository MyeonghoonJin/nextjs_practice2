'use client'
import {signOut} from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignOutBtn(){
    let router = useRouter()

    return(
        <div>
            <button onClick={() => {
                signOut()
                // router.push('/')
            }}>로그아웃</button>
        </div>
    )
}