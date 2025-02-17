'use client'

import { useEffect, useState } from "react"

export default function CommentBtn({id}) {

    let [content,setContent] = useState('')
    let [comments,setComments] = useState([])
    let [likeStatus,setLikeStatus] = useState([])


    //comments에 게시글의 댓글 가져오기
    useEffect(() =>{
        fetch(`/api/comment/list?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
            setComments(data)
            // ✅ 초기 likeStatus 배열을 false로 설정 (렌더링마다 실행되지 않도록 함)
            const initialLikes = data.map(() => false);
            setLikeStatus(initialLikes);
        })
    },[]) // html로드가 될 때 1회만 실행되도록 하도록 설정
    
    return(
        <div>
            {
            comments.length > 0 ?
            comments.map((comment,i) => {

                return(
                    <div key={i}>
                        <h4>작성자 : {comment.authorName}</h4>
                        <p>{comment.content}</p>
                        <span onClick={(e) =>{
                            fetch(`/api/comment/like?id=${comment._id}`)
                            .then(r => r.json())
                            .then((data) => {
                                setLikeStatus(prev => prev.map((val, idx) => idx === i ? data.statusCode : val))
                            })
                        }}>{ likeStatus[i] ? '❤️' : '🤍'} x {comment.likes}
                        </span>
                    </div>
                    )
                }) : '댓글 로딩 중...'
            }
            <br></br>
            <input onChange={(e) => {
                setContent(e.target.value);
            }}/>
            <button onClick={() => {
            fetch('/api/comment/write',{
                method:'POST',
                body:JSON.stringify({content:content,parentId:id}),
                headers:{
                    "Content-Type": "application/json"
                },
            })
            // .then((r) => r.json())
            // .then((result)=>{
            //     setComments([...comments,result])
            //     setContent("") //입력 필드 초기화
            // })  //아직 안되는 거 같음
        }}>댓글 작성</button>
        </div> 
    )
}