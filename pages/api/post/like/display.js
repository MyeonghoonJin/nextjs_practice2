import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDB } from "@/util/database";

export default async function DisplayHandler(요청,응답) {
    
    if(요청.method != 'GET'){
        return 응답.status(200).json('잘못된 요청');
    }

    const client = await connectDB
    const db = await client.db('forum')

    let session = await getServerSession(요청,응답,authOptions)
    
    //post_id
    요청.query.post_id
    //user_id
    let user_id = !session ? '' : session.user.id
    

    //해당 유저가 좋아요 누른 글들의 게시글 좋아요 정보
    let postLikesByMember = await db.collection('postLike').find({user_id : user_id}).toArray()
    //해당 글에 좋아요 누른 게시글 좋아요 정보
    let postLikesByPost = await db.collection('postLike').find({post_id : 요청.query.post_id}).toArray()

    //해당 글의 좋아요 개수
    postLikesByPost.length

    try{
        //유저가 누른 좋아요 중에 해당 글이 포함 되는지 확인
        for (const postLike of postLikesByMember) {
            if (postLike.post_id == 요청.query.post_id) {
                return 응답.status(200).json({
                    likes : postLikesByPost.length , 
                    likeStatus : true,
                })
            };
        }
        //좋아요 누른 적이 없으면
        return 응답.status(200).json({
            likes : postLikesByPost.length , 
            likeStatus : false,
        })
    }    
    catch(error){
        console.log(error)
    }
}