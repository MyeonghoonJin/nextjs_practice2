import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Edit(props) {
    const client = await connectDB
    const db = await client.db('forum')

    let post= await db.collection('post').findOne({_id:new ObjectId(props.params.id)})

    let postInfo = {id:post._id,title:post.title , content:post.content}

    console.log(postInfo)
    return (
        <div className="p-20">
            <h4>글 수정</h4>
            <form action="../api/edit" method="POST">
                <input type="hidden" name="id" value={post._id} />{/* _id를 첨부 */}
                <input type="text" name="title" defaultValue={post.title} />
                <input type="text" name="content" defaultValue={post.content}/>
                <button type="submit">수정 완료</button>
            </form>
        </div>

    );
}