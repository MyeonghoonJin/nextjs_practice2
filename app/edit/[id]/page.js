import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import EditInput from "./input";


export default async function Edit(props) {
    const client = await connectDB;
    const db = await client.db('forum');

    let post_id = props.params.id;
    let post= await db.collection('post').findOne({_id:new ObjectId(post_id)});

    return (
        <div className="p-20">
            <h4>글 수정</h4>
            <EditInput  post = {post}/>
        </div>
    );
}