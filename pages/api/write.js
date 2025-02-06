import { connectDB } from "@/util/database";

export default async function WriteHandler(요청,응답){
    const client = await connectDB
    const db = client.db("forum")
    
    // 요청.body -> 입력값의 json형태
    let 입력값 = 요청.body

    console.log(입력값)
    let newPost = {title:입력값.title, content:입력값.content}
    if(입력값.title != '' && 입력값.content != ''){
        let result = db.collection("post").insertOne(newPost)
        return 응답.status(200).redirect('/list')
    } 
    응답.status(500).json("공백")
}
