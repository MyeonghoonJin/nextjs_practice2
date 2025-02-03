import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Detail(props){

    //db connect
    const client = await connectDB;
    const db = client.db('forum')
     
    //현재 dynamic route에 해당하는 url이 db에 있는 _id값과 일치하면 그 정보를 가져옴
    let post= await db.collection('post').findOne({_id:new ObjectId(props.params.id)})
    
    console.log(props)
    return(
        <div>
            <h1>상세페이지</h1>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
        </div>
    )
}