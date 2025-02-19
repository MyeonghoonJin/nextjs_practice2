import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Count(요청,응답) {

    if(요청.method != 'POST'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }

    try{
        const client = await connectDB
        const db = await client.db('forum')

        //posts
        요청.body

        //commentCnts
        let commentCnts = []
        let likeCnts = []
        for(const post of 요청.body){
            //해당 post의 댓글들
            let comments = await db.collection('comment').find({parentId : new ObjectId(post._id)}).toArray()
            commentCnts.push(comments.length)
            let likes = await db.collection('postLike').find({post_id : post._id}).toArray()
            likeCnts.push(likes.length)   
        }
        return 응답.status(200).json({commentCnts,likeCnts})
    }
    catch(error){
        console.log(error)
        return 응답.status(500).json('서버 오류')
    }
    
    
}