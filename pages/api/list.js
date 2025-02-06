import { connectDB } from "@/util/database";

export default async function ListHandler(요청,응답){

    const client = await connectDB
    const db = client.db("forum")

    let all = await db.collection('post').find().toArray()
    
    console.log(123)
    
    응답.status(200).json(all)
}