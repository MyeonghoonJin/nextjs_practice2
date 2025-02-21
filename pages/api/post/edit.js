import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function EditHandler(요청,응답) {

    if(요청.method != 'POST'){
        return 응답.status(500).json('실패')
    }

    const client = await connectDB
    const db = client.db("forum")

    요청.body = JSON.parse(요청.body)
    // console.log(요청.body)

    let session = await getServerSession(요청,응답,authOptions)

    let target = await db.collection('post').findOne({_id: new ObjectId(요청.body.post_id)})

    
    if(session.user.email == target.author || session.user.role == 'admin'){

        let post_id = 요청.body.post_id

        if(요청.body.title != '' && 요청.body.content != '' ){
            let result = db.collection("post").updateOne(
                {_id: new ObjectId(post_id)}, // 수정할 게시물 선택 
                { $set: { 
                    title: 요청.body.title, 
                    content: 요청.body.content,
                    src : 요청.body.src
                } } // 수정할 document 내용
            )
            return 응답.status(200).json('수정 성공')
        }
        return 응답.status(500).json("공백")  
    }
    응답.status(500).json('수정권한 없음')
}

