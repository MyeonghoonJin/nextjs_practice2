'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListItem({array}){

    let [commentCounts,setCommentCounts] = useState([])
    let [likeCounts,setLikeCounts] = useState([])
    let [postTimes,setPostTimes] = useState([])
    //현재 시간
    let now = new Date().toLocaleString("ko-KR");

    //useEffect는 html이 전부 렌더링 된 후에 실행
    //즉 초기에 데이터가 로딩되지 않아 검색 봇에게 노출이 잘 안된다는 단점
    useEffect(() => {
        //직접 DB에 접근하는 코드 X
        //서버에 DB정보를 요청하는 코드
        //result = DB정보
        fetch('api/post/info',{
            method : 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(array),
        })
        .then(r => r.json())
        .then((data) => {
            setCommentCounts(data.commentCnts)
            setLikeCounts(data.likeCnts)
            setPostTimes(data.postTimes)
        })
    },[])

    let router = useRouter()
    // post 리스트
    let a = array

    return(
        <div>
            {
            a.map((post,index)=>{
                return(
                    <div className="list-item"  key={index}>
                        <Link href = {`detail/${post._id}`}>{post.title}</Link><br></br>
                        <Link className="editButton" href={`/edit/${post._id}`}>✏️</Link>
                        <span onClick={(e) =>{
                            fetch('/api/post/delete',{
                                method : "DELETE",
                                body : post._id 
                            }).then((r) =>{
                                if(r.status == 200){
                                    return r.json();
                                }
                                else{
                                    //서버에서 에러가 생겼을 때
                                }
                            }).then((r) => {
                                e.target.parentElement.style.opacity = 0;
                                setTimeout(() => {
                                    e.target.parentElement.style.display = 'none';
                                },1000)
                                // alert('삭제 되었습니다!')
                                console.log(r);
                                // router.push('/list');
                            }).catch((error) => {
                                console.log(error);
                            })


                            // fetch(`/api/test/id=${post._id}`).then(()=>{
                            //     router.push('/list');
                            // })

                            // fetch(`/api/dynamic/${post._id}/test`).then(() =>{
                            //     router.push('/list');
                            // })
                            
                        }}>🗑️</span><br></br>
                        
                        <span key={index}>
                            <p>
                            작성일 : {postTimes[index]  ? postTimes[index] : '?'}
                            </p>
                            댓글 수 : {commentCounts[index] >= 0 ? commentCounts[index] : '?'}
                            <br></br>
                            추천 수 : {likeCounts[index] >= 0 ? likeCounts[index] : '?'}
                        </span>
                        {/* <DetailLink/> */}
                    </div>
                )
            })
        }
        <div className="list-page-btn">
            [처음][이전] [1],[2],...[10] [다음][마지막]
        </div>
        </div>
    )
}