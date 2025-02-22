import { connectDB } from "@/util/database";
import { cookies } from "next/headers";
//DB 입출력 코드는 반드시 server component에서만 사용
//await 쓸려면 함수에 async 필요
//await은 해당 코드가 처리가 늦어지면 제끼고 다음 코드로 넘어가는 키워드
export default async function Home() {

  // const client = await connectDB;
  // const db = client.db("forum")

  //object 자료형 : {key : value , ...} 형태의 자료형
  //object 자료형의 특정 value만 출력하려면?
  //console.log(object.key) 와 같이

  // let res =  (await cookies()).get('darkMode')
  // let currentCookie = res ? res.value : 'off'
  
  // let className = (res != undefined && res.value == 'on') ? 'dark-mode' : 'light-mode'
  return (
    <div><a>메인페이지</a></div>
  );
}
