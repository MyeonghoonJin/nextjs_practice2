import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Comment from "./comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Like from "./like";
import { notFound } from "next/navigation";

export default async function Detail({params}){

    //db connect
    const client = await connectDB;
    const db = client.db('forum')
    
    //게시글 id
    let post_id = params.id;
    //현재 dynamic route에 해당하는 url이 db에 있는 _id값과 일치하면 그 정보를 가져옴
    let post= await db.collection('post').findOne({_id:new ObjectId(post_id)})
    let comments= await db.collection('comment').find().toArray()

    //임의로 post_id 주작해서 들어가면 404뜨게 처리
    if(post === null){
        return notFound()
    }

    let session = await getServerSession(authOptions)

    console.log(session)

    return(
        <div>
            <h1>상세페이지</h1>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <Like post_id = {post_id} user_id = {session ? session.user.id : ''}  />
            <hr></hr>
            {
            <Comment 
                post_id = {post_id} 
                user_id = {session ? session.user.id : ''} 
                user_name = {session ? session.user.name : ''} 
                user_email = {session ? session.user.email : ''}
                /> 
            }
        </div>
    )
}