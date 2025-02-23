import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Info(요청,응답) {

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
        let postTimes = []
        for(const post of 요청.body){
            //해당 post의 댓글들
            let commentCnt = await db.collection('comment').find({parentId : new ObjectId(post._id)}).toArray()
            commentCnts = [commentCnt.length, ...commentCnts]
            let likeCnt = await db.collection('postLike').find({post_id : post._id}).toArray()
            likeCnts = [likeCnt.length, ... likeCnts]
            let objectId = new ObjectId(post._id)
            let postTime = objectId.getTimestamp().toLocaleString("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // 24시간 형식
                timeZone: "Asia/Seoul", // ✅ 한국 시간(KST) 적용
            }).replace(/\./g, "").replace(/(\d{2}) (\d{2})/, "$1.$2");
            postTimes = [postTime,...postTimes]
        }
        return 응답.status(200).json({commentCnts,likeCnts,postTimes})
    }
    catch(error){
        console.log(error)
        return 응답.status(500).json('서버 오류')
    }
    
    
}