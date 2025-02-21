'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DarkModeOnBtn({currentCookie}){

    let router = useRouter()
    // console.log(currentCookie)

    useEffect(()=>{
        //name이 darkMode인 쿠키값 가져오기
        let 쿠키값 = ('; '+document.cookie).split(`; darkMode=`).pop().split(';')[0]

        if (쿠키값 == '') {
            document.cookie = 'darkMode=off; Path=/ ; max-age=' + (3600 * 24 * 400)
        }
    },[])
    return(
        <div>
            <button onClick={() =>{
                // let currentCookie = ('; '+document.cookie).split(`; darkMode=`).pop().split(';')[0]
                currentCookie == 'on' ? 
                document.cookie = 'darkMode=off; Path=/ ;max-age=' + (3600 * 24 * 400) : 
                currentCookie == 'off' ?
                document.cookie = 'darkMode=on; Path=/ ;max-age=' + (3600 * 24 * 400) : ''

                router.refresh()
            }}>
                {
                    currentCookie == 'on'? '☀️' : 
                    currentCookie == 'off' ? '🌙' : ''
                }
            </button>
        </div>
    )
}