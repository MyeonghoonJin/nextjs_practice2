import { connectDB } from "@/util/database"
import { revalidate } from "../list2/page"
import { revalidatePath } from "next/cache"

export default async function Write2(){
    
    const db = await (await connectDB).db('forum')
    let res = await db.collection('post_test').find().toArray()
    console.log(res)

    async function handleSubmit(formData){
        //서버 api로 변신
        'use server'
        const db = await (await connectDB).db('forum')
        await db.collection('post_test').insertOne({
            title : formData.get('title'),
            content : formData.get('content')
        })
        revalidatePath('/write2')
    }
        
    return(
        <div>
            <form  action={handleSubmit}>
                <input name="title" placeholder="아이디"></input>
                <input name="content" placeholder="비밀번호"></input>
                {/* <input name=""></input> */}
                <button type="submit">버튼</button>
            </form>
            {
                res ? res.map((a,i) => 
                    <div>
                        <p>제목 : {a.title}</p>
                        <p>내용 : {a.content}</p>
                    </div>
                ) : ''
            }
        </div>
    )
}