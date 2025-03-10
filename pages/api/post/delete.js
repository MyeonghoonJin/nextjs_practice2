import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function Delete(요청,응답){

    if (요청.method !== "DELETE") {
        return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
    }
    
    let session = await getServerSession(요청,응답,authOptions)

    try{
        //JSON : Object형태에서 속성이 큰 따옴표로 되어 있는 것
        //JSON -> Object변환은 JSON.parse()를 쓰자
        const client = await connectDB;
        const db = await client.db("forum");

        let post_id = 요청.body;
        let target = await db.collection('post').findOne({_id: new ObjectId(post_id)})
        let result
        //comments 삭제
        let deleteComments = await db.collection('comment').deleteMany({parentId : new ObjectId(post_id) })
        //postLike 삭제
        let deleteLikes = await db.collection('postLike').deleteMany({
            post_id : post_id
        })

        if(!session){
            return 응답.status(500).json({error:"로그인 필요"})
        }
        else{
            // 글쓴이 또는 admin인 경우
           if(session.user.email == target.author || session.user.email == 'audgns1947@dgu.ac.kr'){
                result = await db.collection('post').deleteOne({_id:new ObjectId(post_id)});
                return 응답.status(200).json('1개 삭제 성공');
            }
            //삭제 권한이 없는 경우
            else{
                return 응답.status(403).json('삭제 권한 없음')
            }
        }
        // switch(result.deletedCount){
        //     case 0:
        //         return 응답.status(500).json('삭제 실패');
        //     case 1:
                
        //     default:
        //         return 응답.status(200).json('여러개 삭제 성공');
        // }
    }
    catch(error){
        console.log(error);
        return 응답.status(500).json({error:"서버 오류"})
    }   
}