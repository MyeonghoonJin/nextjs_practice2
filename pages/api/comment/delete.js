import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function CommentDeleteHandler(요청,응답) {
    
    if(요청.method != 'GET'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }
    const client = await connectDB
    const db = await client.db('forum')

    //삭제할 comment_id
    요청.query.comment_id

    try{
        let result = await db.collection('comment').deleteOne({_id : new ObjectId(요청.query.comment_id)})
    }
    catch(error){
        console.log(error)
    }
    응답.status(200).json('댓글 삭제 완료')
}