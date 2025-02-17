import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function LikeHandler(요청,응답) {
    
    if(요청.method != 'GET'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }

    const client = await connectDB
    const db = await client.db('forum')


    let session = await getServerSession(요청,응답,authOptions)
    let user = await db.collection('member').findOne({email:session.user.email})

    //좋아요 누른 멤버 email
    session.user.email
    //좋아요 누른 댓글 id
    요청.query.id

    

    // console.log(user)
    for (const likedCommentId of user.commentLikeList){
        // let likedComment = await db.collection('comment').findOne({_id : new ObjectId(likedCommentId)})

        //좋아요 누른 댓글이 세션 유저가 좋아요 누른 적이 있는 경우
        if(요청.query.id == likedCommentId){
            await db.collection('comment').updateOne(
                {_id : new ObjectId(요청.query.id)},
                {$inc : {likes : -1}}
            )
            //좋아요 누른 댓글 삭제
            await db.collection('member').updateOne(
                {email : user.email},
                {$pull : {commentLikeList: 요청.query.id}}
            )
            return 응답.status(200).json({statusCode : 0})
        }
    }

    //좋아요 누른 댓글이 세션 유저가 좋아요 누른 적이 없는 경우
    await db.collection('comment').updateOne(
        {_id : new ObjectId(요청.query.id)},
        {$inc : {likes : 1}}
    )
    //좋아요 누른 댓글 추가
    let result = await db.collection('member').updateOne(
        {email : user.email},
        {$addToSet : {commentLikeList: 요청.query.id}}
    )
    응답.status(200).json({statusCode : 1, commentId : 요청.query.id})
}