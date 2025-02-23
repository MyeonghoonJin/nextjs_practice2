import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function middleware(request){

    //console.log(request.nextUrl) // 유저가 요청중인 url
    //console.log(request.headers) // 유저의 header 정보

    //NextResponse.next()         // 요청 그대로 전달
    //NextResponse.redirect()     // 다른 페이지로 강제이동(주소창 변경 O)
    //NextResponse.rewrite()      // 다른 페이지로 강제이동(주소창 변경 X)


    
    // 로그인 없이 글 작성페이지 제어
    const session = await getToken({req : request})
    // console.log(request.nextUrl)

    //특정 사람의 방문 수 (쿠키에 저장)
    if(request.nextUrl.pathname.startsWith('/write') && session){
        if(session.user.name == '진명훈'){
            if(!request.cookies.has('visitedCnt_jinMyeongHoon')){
                //쿠키 생성
                const response = NextResponse.next()
                response.cookies.set({
                    name: 'visitedCnt_jinMyeongHoon',
                    value: '1',
                    maxAge: 3600,
                    httpOnly : true
                })
                return response
            }
            let res = (await cookies()).get('visitedCnt_jinMyeongHoon')
            res = (parseInt(res.value) + 1).toString()
            //쿠키 수정
            const response2 = NextResponse.next()
            response2.cookies.set({
                name: 'visitedCnt_jinMyeongHoon',
                value: res,
                maxAge: 3600,
                httpOnly : true
            })
            return response2
        }
    }

    if(request.nextUrl.pathname.startsWith('/register')){
        if(!request.cookies.has('visited')){
            // 쿠키 생성
            const response = NextResponse.next()
            response.cookies.set({
                name: 'visited',
                value: 'true',
                maxAge: 3600,
                httpOnly : true
            })  
            return response 
        }
    }



    // if(request.nextUrl.pathname == '/api/post/delete'){
    //     // if(session.user.role == 'admin' || )
    // }
}