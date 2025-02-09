'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ListItem({array}){

    //useEffect는 html이 전부 렌더링 된 후에 실행
    //즉 초기에 데이터가 로딩되지 않아 검색 봇에게 노출이 잘 안된다는 단점
    useEffect(() => {
        //직접 DB에 접근하는 코드 X
        //서버에 DB정보를 요청하는 코드
        //result = DB정보

    },[])

    let router = useRouter()
    let a = array
    return(
        <div>
            {
            a.map((post,index)=>{
                return(
                    <div className="list-item"  key={index}>
                        <Link href = {`detail/${post._id}`}>{post.title}</Link><br></br>
                        <Link className="editButton" href={`/edit/${post._id}`}>✏️</Link>
                        <span onClick={() =>{
                            fetch('/api/delete',{
                                method : "DELETE",
                                body : post._id 
                            }).then((r) =>{
                                if(r.status == 200){
                                    return r.json();
                                }
                            }).then((r) => {
                                alert('삭제 되었습니다!')
                                console.log(r);
                                router.push('/list');
                            }).catch((error) => {
                                console.log(error);
                            })
                        }}>🗑️</span>
                        <p>날짜</p>
                        <p>1월 1일</p>
                        {/* <DetailLink/> */}
                    </div>
                )
            })
        }
        </div>
    )
}