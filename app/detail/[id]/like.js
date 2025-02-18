'use client'
import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Like({post_id,user_id}) {

    let [likeStatus,setLikeStatus] = useState()
    let [likes,setLikes] = useState(0)
    useEffect(()=>{
        fetch('/api/post/like/display?post_id=' + post_id)
        .then(r => r.json())
        .then((data) => {
            setLikes(data.likes)
            setLikeStatus(data.likeStatus)
        })
    },[])
    
    return(
        
        <div>
            <h5>글 추천 버튼</h5>
            <button className="post-like-btn" onClick={(e) =>{
                
                if(user_id == ''){
                    alert('로그인이 필요합니다.')
                    signIn()
                    return
                }
                let newLikeStatus = likeStatus
                let LikesCount =  newLikeStatus ? likes - 1 : likes + 1;
                setLikeStatus(!newLikeStatus)
                setLikes(LikesCount)
                fetch(`/api/post/like/toggle?post_id=${post_id}`
                )
                .then(r=>r.json())
                .then(()=>{

                })
            }}>{ likeStatus ? <img src="/thumbs-up_yes.png" alt="No Img" width= '30px'/> : <img src="/thumbs-up_no.png" alt="No Img" width= '30px'/> } x {likes}</button>
        </div>
    )
}