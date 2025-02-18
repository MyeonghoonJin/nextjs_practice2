import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function CommentWriteHandler(요청,응답){

    if(요청.method != 'POST'){
        return 응답.status(200).json('잘못된 요청');
    }

    const client = await connectDB;
    const db = await client.db('forum');

    let session = await getServerSession(요청,응답,authOptions);

    if(!session){
        return 응답.status(500).json('권한 없음');
    }

    let newComment = {
        content : 요청.body.content, 
        author : session.user.email, 
        parentId: new ObjectId(요청.body.parentId), 
        authorName : session.user.name , 
        likes : 0,
    };

    try{
        if(!newComment.content || !newComment.parentId){
            return 응답.status(500).json('공백 또는 게시글 없음')
        }
        let result = db.collection('comment').insertOne(newComment);
        응답.status(200).json(newComment)
    }
    catch(error){
        console.log(error);
        return 응답.status(500).json({error:'서버 오류'})
    }
    

}