import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function EditHandler(요청,응답) {
    const client = await connectDB
    const db = client.db("forum")

    // 요청.body -> 입력값의 json형태
    let 입력값 = 요청.body

    let newPost = {title:입력값.title, content:입력값.content}
    let id = 입력값.id

    if(입력값.title != '' && 입력값.content != ''){
        let result = db.collection("post").updateOne(
            {_id: new ObjectId(id)}, // 수정할 게시물 선택 
            { $set: { title: 입력값.title, content: 입력값.content } } // 수정할 document 내용
        )
        return 응답.status(200).redirect('/list')
    }
    응답.status(200).json("실패") 
}