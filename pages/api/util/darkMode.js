import { cookies } from "next/headers";

export default function DarkMode(요청,응답) {
    
    if(요청.method != 'GET'){
        응답.status(405).json({ message: "Method Not Allowed" });
    }

    let res = 요청.cookies.darkMode
    let currentCookie = res || "off";
    let result = (currentCookie == 'off' ? 'on' : 'off')
    // console.log(result)

    try{
        응답.setHeader('Set-Cookie',`darkMode=${result}; Path=/; Max-Age=31536000;` // 지속 쿠키
        )
        응답.status(200).json('darkMode' + result)
    }
    catch(error){
        console.log(error)
        응답.status(500).json('서버 오류')
    }
}