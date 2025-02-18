'use client'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Comment({post_id,user_id,user_name,user_role}) {

    let [content,setContent] = useState('')
    let [comments,setComments] = useState([])
    let [likeStatus,setLikeStatus] = useState([])
    let [isClicked,setIsClicked] = useState(false)
    let router = useRouter()

    //comments에 게시글의 댓글 가져오기
    useEffect(() =>{
        fetch(`/api/comment/list?id=${post_id}`)
        .then((r) => r.json())
        .then((data) => {
            //댓글 가져오기
            setComments(data)

            // ✅ 초기 likeStatus 배열을 false로 설정 (렌더링마다 실행되지 않도록 함)
            const initialLikes = data.map(() => false);
            setLikeStatus(initialLikes);

            //가져온 댓글 중에서 각각의 likedMember에서 user_id가 있는지 순회
            //있으면  
            data.forEach((comment,idx) =>{
                comment.likedMember.forEach((likedMember,i) => {
                    if(user_id == likedMember){
                        setLikeStatus(
                            prev => prev.map((item,index) => index === idx ? true : item
                            )
                        )
                    }
                });
            })
            if (isClicked) router.refresh()
        }
    )},[post_id,isClicked]) // html로드가 될 때 1회만 실행되도록 하도록 설정
    
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
                            (user_role == 'admin') ? 
                            <button onClick={(e) => {
                                fetch('/api/comment/delete?comment_id=' + comment._id)
                                .then(r => r.json())
                                .then(() => {
                                    setTimeout(() => {
                                        e.target.parentElement.style.display = 'none';
                                    },300)
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