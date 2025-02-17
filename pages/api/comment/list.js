import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function CommentList(요청,응답){

    if(요청.method != 'GET'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }

    try{
        const client = await connectDB;
        const db = await client.db('forum');

        let comments = await db.collection('comment').find({parentId : new ObjectId(요청.query.id)}).toArray();

        응답.status(200).json(comments);
    }
    catch(error){
        console.log(error);
        응답.status(500).json('서버 오류');
    }
}