'use client'

import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function EditInput({post}) {
    
    // console.log(post)

    let [editedTitle,setEditedTitle] = useState(post.title)
    let [editedContent,setEditedContent] = useState(post.content)
    let [editedSrc,setEditedSrc] = useState(post.src)
    let [preSrc,setPreSrc] = useState(post.src)
    let [loading, setLoading] = useState(true);
    let fileInputRef = useRef();

    // console.log(preSrc)               //https://s3.ap-northeast-2.amazonaws.com/myeonghoonjinstorage/thumbs-up_yes.png
    // console.log(post.src)             //https://s3.ap-northeast-2.amazonaws.com/myeonghoonjinstorage/thumbs-up_yes.png
    // console.log(fileInputRef.current) //null
    // console.log(editedSrc)            //https://s3.ap-northeast-2.amazonaws.com/myeonghoonjinstorage/thumbs-up_yes.png
    let router = useRouter()
    useEffect(()=>{
        //수정 권한 확인
        getSession().then(session => {
            if (!session) {
                alert("로그인이 필요합니다.");
                signIn();
            } else if((session.user.email != post.author) && (session.user.email != 'audgns1947@dgu.ac.kr')){
                alert("수정 권한이 없습니다!");
                router.push("/list");
            }
            else{
                setLoading(false);
            }
        
        });
        return () => {
            if (preSrc) {
                URL.revokeObjectURL(preSrc);
            }
        };
    },[])
    if (loading) return <p>로딩 중...</p>;
    return(
        <div>
            <input type="text" name="title" defaultValue={post.title} onChange={(e) => {
                setEditedTitle(e.target.value)
            }}/>
            <input type="text" name="content" defaultValue={post.content} onChange={(e) => {
                setEditedContent(e.target.value)
            }}/>

            {/* 미리보기 사진 제거 */}
            {
                
                preSrc ? 
                    <div>
                        <img src={preSrc == '' ? null : preSrc}/>
                        <button onClick={() => {
                            if (fileInputRef.current) {
                                setPreSrc('')
                                fileInputRef.current.value = ""; // ✅ 파일 선택 초기화
                                router.refresh()
                            }
                        }}>X</button>
                    </div>
                    :
                    ''
            } 
            
            <input type="file" name="editedSrc"  ref={fileInputRef} onChange={async(e) => {
                console.log(fileInputRef.current.value)
                let file = e.target.files[0]

                if (!file) {
                    console.error("파일이 선택되지 않았습니다.");
                    return;
                }
                //미리보기용 사진 교체
                const objectURL = URL.createObjectURL(file);
                setPreSrc(objectURL)

                //한글 깨짐 방지용
                let encodedFile = encodeURIComponent(file.name)

                //
                let result = await fetch('../api/post/write/presignedURL?file=' + encodedFile)
                result = await result.json()

                //S3 업로드 
                const formData = new FormData()
                Object.entries({ ...result.fields, file }).forEach(([key, value]) => {
                    formData.append(key, value)
                })

                let 업로드결과 = await fetch(result.url, {
                    method: 'POST',
                    body: formData,
                })
                // console.log(업로드결과)

                if (업로드결과.ok) {
                    setEditedSrc(업로드결과.url + '/' + encodedFile)
                } else {
                    console.log('실패')
                    }
                // console.log(editedSrc)
            }}/>
            <button onClick={()=>{
                console.log(preSrc) 
               
                fetch('../api/post/edit',{
                    method : 'POST',
                    body : JSON.stringify({
                        title : editedTitle,
                        content : editedContent,
                        src : preSrc == '' ? '' : editedSrc,
                        post_id : post._id
                    })
                })
                .then(() => {
                    alert('글이 수정되었습니다!')
                    router.push('/list')
                })
            }}>수정하기</button>
        </div>
    )
}