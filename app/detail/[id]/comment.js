'use client'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Comment({post_id,user_id,user_name,user_email}) {

    let [content,setContent] = useState('')
    let [comments,setComments] = useState([])
    let [likeStatus,setLikeStatus] = useState([])
    let [isClicked,setIsClicked] = useState(false)
    let router = useRouter()
    
    //comments에 게시글의 댓글 가져오기
    useEffect(() =>{
        //fetch 비동기 처리
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comment/list?id=${post_id}`)
                const data = await response.json()
    
                if (!data || !Array.isArray(data)) {
                    console.error("데이터가 존재하지 않음:", data)
                    return
                }
    
                setComments(data);
    
                // ✅ 초기 좋아요 상태 설정
                setLikeStatus(data.map(() => false));
    
                // ✅ likedMember가 존재하는지 체크 후 처리
                data.forEach((comment, idx) => {
                    if (!comment.likedMember || !Array.isArray(comment.likedMember)) return;
                    comment.likedMember.forEach((likedMember) => {
                        if (user_id == likedMember) {
                            setLikeStatus(prev =>
                                prev.map((item, index) => (index === idx ? true : item))
                            )
                        }
                    })
                })
                if (isClicked) {
                    router.refresh()
                    setIsClicked(false)
                }
            } catch (error) {
                console.error("댓글 데이터를 불러오는 중 오류 발생:", error)
            }
        }
        fetchComments()

    },[post_id,isClicked]) // html로드가 될 때 1회만 실행되도록 하도록 설정
    
    return(
        <div>
            <h2>댓글</h2>
            {
            comments.length > 0 ?
            comments.map((comment,i) => {
                return(
                    <div key={i}>
                        <h4>작성자 : {comment ? comment.authorName : user_name}</h4>
                        <p>{comment.content}</p>
                        <button  onClick={(e) =>{

                            if(user_id == ''){
                                alert('로그인이 필요합니다.')
                                signIn()
                                return
                            }
                            let newLikeStatus = !likeStatus[i];
                            let newLikesCount = newLikeStatus ? comment.likes + 1 : comment.likes - 1;
                            
                            setLikeStatus(prev => prev.map((item, index) => index === i ? newLikeStatus : item));
                            setComments(prev => prev.map((c, index) => index === i ? { ...c, likes: newLikesCount } : c));

                            fetch(`/api/comment/like?id=${comment._id}`)
                            .then(r => r.json())
                            .then((data) => {

                            })
                        }}>{likeStatus[i] ? '❤️' : '🤍' }
                        </button><span> x {comment.likes}</span><br></br><br></br>
                        {
                            (user_email == 'audgns1947@dgu.ac.kr') ? 
                            <button onClick={(e) => {
                                fetch('/api/comment/delete?comment_id=' + comment._id)
                                .then(r => r.json())
                                .then(() => {
                                    isClicked ? e.target.parentElement.style.display = 'none' : ''
                                    setIsClicked(!isClicked)
                                })
                            }}>댓글 삭제</button> 
                            : ''
                        }
                    </div>
                    )
                }) : '댓글 로딩 중...'
            }
            <br></br>
            <div>
                {
                    (user_id == '') ? '' : 
                    <div>
                        <input onChange={(e) => {
                            setContent(e.target.value);
                        }} value={content}/>
                        <button onClick={() => {
                        fetch('/api/comment/write',{
                            method:'POST',
                            body:JSON.stringify({
                                content:content,
                                parentId:post_id
                            }),
                            headers:{
                                "Content-Type": "application/json"
                            },
                        })
                        .then((r) => r.json())
                        .then(()=>{
                            setContent("")
                            setIsClicked(!isClicked)
                        })
                        
                        }}>댓글 작성</button>
                    </div>
                }
            </div>
        </div> 
    )
}