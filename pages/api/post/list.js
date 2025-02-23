import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function List(요청,응답) {
    
    if(요청.method != 'GET'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }
    
    try{
        const client = await connectDB
        const db = await client.db('forum')

        //댓글 수
        let commentCnts = []
        //좋아요 수
        let likeCnts = []
        //작성된 시간
        let postTimes = []
        //page
        let page = 요청.query.page
        //페이지당 게시글 개수 
        let limit = 10
        //스킵할 게시글 개수
        let skip = (page - 1) * limit
        //해당 페이지에 있는 게시글
        let posts = await db.collection('post').find()
        .sort({ _id: -1 })
        .skip(skip).limit(limit)
        .toArray();
        // 마지막 페이지인지
        let isLastPage = false
        let postLength = await db.collection('post').countDocuments()
        if(page*limit - postLength >= 0){
            isLastPage = true
        }
        for(const post of posts){
            //해당 post의 댓글들
            let commentCnt = await db.collection('comment').find({parentId : post._id}).toArray()
            commentCnts.push(commentCnt.length)
            let likeCnt = await db.collection('postLike').find({post_id : post._id.toString()}).toArray()
            likeCnts.push(likeCnt.length)
            let postTime = post._id.getTimestamp().toLocaleString("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // 24시간 형식
                timeZone: "Asia/Seoul", // ✅ 한국 시간(KST) 적용
            }).replace(/\./g, "").replace(/(\d{2}) (\d{2})/, "$1.$2");
            postTimes.push(postTime)
        }
        return 응답.status(200).json({posts,commentCnts,likeCnts,postTimes,isLastPage})
        
    }
    catch(error){
        console.log(error)
        응답.status(500).json('서버 오류')
    }
}