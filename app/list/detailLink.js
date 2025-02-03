"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DetailLink(){

    let router = useRouter()
    let pathName = usePathname() // url

    return(
        <button onClick={() =>{
            router.refresh()
        }}>버튼</button>
    );
}