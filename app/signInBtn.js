'use client'
import {signIn} from "next-auth/react"
import Link from "next/link";

export default function SignInBtn(){


    return(
        <div>
            <button onClick={() => {
                signIn()
            }}>로그인</button> 
            <Link href='/register'>
                <button>회원가입</button>
            </Link>
        </div>
    )
}