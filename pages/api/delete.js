import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Delete(요청,응답){

    if (요청.method !== "DELETE") {
        return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
    }
    
    try{
        //JSON : Object형태에서 속성이 큰 따옴표로 되어 있는 것
        //JSON -> Object변환은 JSON.parse()를 쓰자
        const client = await connectDB;
        const db = await client.db("forum");
        console.log(요청.body);
        let id = 요청.body;

        let result = await db.collection('post').deleteOne({_id:new ObjectId(id)})
        console.log(result)
        
        switch(result.deletedCount){
            case 0:
                return 응답.status(500).json('삭제 실패');
            case 1:
                return 응답.status(200).json('1개 삭제 성공');
            default:
                return 응답.status(200).json('여러개 삭제 성공');
        }
    }
    catch(error){
        console.log(error);
        return 응답.status(500).json({error:"서버 오류"})
    }   
}