'use client'
import {signIn} from "next-auth/react"
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignInBtn(){

    return(
        <div>
            <button onClick={() => {
                signIn();
            }}>로그인</button> 
            <Link href='/register'>
                <button>회원가입</button>
            </Link>
        </div>
    )
}