import { connectDB } from "@/util/database";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function ToggleHandler(요청,응답) {

    if(요청.method != 'GET'){
        return 응답.status(200).json('잘못된 요청');
    }
    const client = await connectDB
    const db = await client.db('forum')

    let session = await getServerSession(요청,응답,authOptions)

    //post_id
    console.log(요청.query.post_id)
    //user_id
    session.user.id

    //해당 유저가 좋아요 누른 글들의 게시글 좋아요 정보
    let postLikesByMember = await db.collection('postLike').find({user_id : session.user.id}).toArray()

    try{
        //유저가 누른 좋아요 중에 해당 글이 포함 되는지 확인
        for (const postLike of postLikesByMember) {
            // 이미 눌렀으면
            if (postLike.post_id == 요청.query.post_id) {
                await db.collection('postLike').deleteOne({ 
                    post_id: 요청.query.post_id, 
                    user_id: session.user.id
                });
                return 응답.status(200).json('이미 좋아요 눌렀음.');
            }
        }        
        // 안 눌렀으면
        //db에 post_id - likedMember 저장
        let result = await db.collection('postLike').insertOne({
            post_id : 요청.query.post_id,
            user_id : session.user.id
        })
        return 응답.status(200).json('좋아요 저장완료')
    }
    catch(error){
        console.log(error)
    }
}