import { connectDB } from "@/util/database";
import Link from "next/link";
import DetailLink from "./detailLink";
import ListItem from "./listItem";
import { getSession } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// static rendering하는 페이지를 dynamic rendering이 되도록 하는 문장
export const dynamic = 'force-dynamic'
// dynamic rendering의 단점 : 페이지를 로드할 때 마다 서버와 DB에 접근하기 때문에 서버나 DB의 부담이 큼
// 이러한 단점을 해결하는 방법 -> caching 기능 
// caching 기능이란 서버나 DB에서 받아온 데이터들을 임시로 캐시에 저장해서 자주 사용하는 데이터를 바로 전달할 수 있는 기능
// export const revalidate = ??  -> ??초만큼 해당 페이지의 캐싱을 저장하는 예악어 문장
// fetch함수에 next: {revalidate  : ?? } 를 설정하면 캐싱 시간을 조절 가능
export default async function List() {

    const client = await connectDB;
    const db = client.db("forum")
  
  
    let posts = await db.collection('post').find().toArray()
    let plainPosts = []
    // let session = await getSession(authOptions)
    // console.log(session)

    // Link 태그는 자동으로 prefetch 기능이 있음
    // 즉, Link를 누르기 전에 페이지 내용이 preload 됨.
    // 장점 : preload 되기 때문에 빠른 페이지 로딩
    // 단점 : 페이지에 보이는 모든 링크의 데이터를 모두 preload하게 됨.
    // 'prefetch={false}' 속성을 추가해서 비활성화 가능
    // 개발중에는 확인불가 

    // document객체 직렬화

    if(posts){
      for(const post of posts){
        const plainPost = {
        ...post,
        _id: post._id.toString(), //  _id를 String으로 변환
        };
        plainPosts.push(plainPost)
      }
    }
    
    
    return (
    <div className="list-bg">
        <ListItem array = {plainPosts} ></ListItem>
      </div>
    );
  }