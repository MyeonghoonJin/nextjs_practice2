import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Comment from "./comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Like from "./like";

export default async function Detail({params}){

    //db connect
    const client = await connectDB;
    const db = client.db('forum')
    
    //게시글 id
    let id = params.id;
    //현재 dynamic route에 해당하는 url이 db에 있는 _id값과 일치하면 그 정보를 가져옴
    let post= await db.collection('post').findOne({_id:new ObjectId(id)})
    let comments= await db.collection('comment').find().toArray()

    
    let session = await getServerSession(authOptions)

    

    return(
        <div>
            <h1>상세페이지</h1>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <Like post_id = {id} user_id = {session ? session.user.id : ''}  />
            <hr></hr>
            {
                 <Comment 
                    post_id = {id} 
                    ser_id = {session ? session.user.id : ''} 
                    user_name = {session ? session.user.name : ''} 
                    user_role = {session ? session.user.role : ''}
                    /> 
            }
        </div>
    )
}