import { connectDB } from "@/util/database";
import Link from "next/link";
import DetailLink from "./detailLink";
import ListItem from "./listItem";

export default async function List() {

    const client = await connectDB;
    const db = client.db("forum")
  
  
    let a = await db.collection('post').find().toArray()

    // Link 태그는 자동으로 prefetch 기능이 있음
    // 즉, Link를 누르기 전에 페이지 내용이 preload 됨.
    // 장점 : preload 되기 때문에 빠른 페이지 로딩
    // 단점 : 페이지에 보이는 모든 링크의 데이터를 모두 preload하게 됨.
    // 'prefetch={false}' 속성을 추가해서 비활성화 가능
    // 개발중에는 확인불가 
    return (
    <div className="list-bg">
        <ListItem array = {a} ></ListItem>
      </div>
    );
  }