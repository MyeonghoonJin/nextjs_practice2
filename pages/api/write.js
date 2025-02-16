import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function WriteHandler(요청,응답){

    const client = await connectDB
    const db = client.db("forum")
    
    
    
    let session = await getServerSession(요청,응답,authOptions)

    if(session){
        요청.body.author = session.user.email
    }
    console.log(요청.body)

    if(요청.body.title != '' && 요청.body.content != ''){
        let result = db.collection("post").insertOne(요청.body)
        return 응답.status(200).redirect('/list')
    } 
    응답.status(500).json("공백")
}
