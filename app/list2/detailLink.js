"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DetailLink(){

    let router = useRouter()     // useRouter는 페이지 이동과 관련된 다양한 기능을 가진 함수들을 가진 객체임
    let pathName = usePathname() // url

    return(
        <button onClick={() =>{
            router.refresh()
        }}>버튼</button>
    );
}