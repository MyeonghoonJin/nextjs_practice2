'use client'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListItem({array}){

    let [commentCounts,setCommentCounts] = useState([])
    let [likeCounts,setLikeCounts] = useState([])
    let [postTimes,setPostTimes] = useState([])
    let [posts,setPosts] = useState([{}])
    let [isLastPage,setIsLastPage] = useState()
    let [loading,setLoading] = useState(false)

    let searchParams = useSearchParams()
    //현재 페이지
    let page = parseInt(searchParams.get("page") || "1");
    

    //useEffect는 html이 전부 렌더링 된 후에 실행
    //즉 초기에 데이터가 로딩되지 않아 검색 봇에게 노출이 잘 안된다는 단점
    useEffect(() => {
        
        //post가져오기 (페이지별로)
        fetch('api/post/list?page='+ page)
        .then(r => r.json())
        .then((data) => {
            setPosts(data.posts)
            setCommentCounts(data.commentCnts)
            setLikeCounts(data.likeCnts)
            setPostTimes(data.postTimes)
            setIsLastPage(data.isLastPage)
            setLoading(true)
        })
    },[page])

    let router = useRouter()
    // post 리스트
    let a = array

    const handleRouter = () => {
        router.push('/list?page' + (page - 1))
    }

    if(!loading) return <a>로딩중...</a>
    return(
        <div>
            {
            posts.map((post,index)=>{
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
                                   e.target.parentElement.style.opacity = 0;
                                   setTimeout(() => {
                                       e.target.parentElement.style.display = 'none';
                                   },500)
                                   alert('삭제 되었습니다!')
                                   router.refresh();
                                   return r.json();
                                }
                                //삭제 권한 없을 경우
                                else if(r.status == 403){
                                   alert('삭제 권한 없음')
                                   router.refresh();
                                }
                             })
                            //  .catch((error) => {
                            //      console.log(error);
                            //  })


                             // fetch(`/api/test/id=${post._id}`).then(()=>{
                             //     router.push('/list');
                             // })

                             // fetch(`/api/dynamic/${post._id}/test`).then(() =>{
                             //     router.push('/list');
                             // })
                          
                         }}>🗑️</span><br></br>
                      
                          <span>
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
                {/* ✅ 왼쪽 버튼 컨테이너 */}
                <div className="left-buttons">
                    {page > 1 && (
                        <>
                            <span className="init-Btn" onClick={() => router.push('/list?page=1')}>
                                [처음]
                            </span>
                            <span className="prev-Btn" onClick={() => router.push('/list?page=' + (page - 1))}>
                                [이전]
                            </span>
                        </>
                    )}
                </div>

                {/* ✅ 페이지 번호 (항상 중앙) */}
                <div className="page-number">[{page}]</div>

                {/* ✅ 오른쪽 버튼 컨테이너 */}
                <div className="right-buttons">
                    {!isLastPage && (
                        <span className="next-Btn" onClick={() => router.push('/list?page=' + (page + 1))}>
                            [다음]
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}