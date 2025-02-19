import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

export default async function Write(){


    let session = await getServerSession(authOptions);


    if(!session){
        return(
            <div>
                <h1>로그인하셈</h1>
            </div>
        )
    }
    return(
        <div className="p-20">
            <h4>글 작성</h4>
            <form action="/api/post/write" method="POST">
                <input type="text" name="title" placeholder="제목입력" />
                <input type="text" name="content" placeholder="내용입력"/>
                <button type="submit">입력</button>
            </form>
        </div>
    )
}