'use client'

import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react";
import { useEffect, useReducer, useState } from "react"

export default function Write(){

    let [src,setSrc] = useState('')
    let [title,setTitle] = useState('')
    let [content,setContent] = useState('')
    let [preview,setPreview] = useState('')
    let [loading, setLoading] = useState(true);
    let router = useRouter()
    // const formData = new FormData()
    // formData.append("title",title)
    // formData.append("content",content)
    // formData.append("url",src)

    // console.log(formData)

    useEffect(() => {
        getSession().then(session => {
            if (!session) {
                alert("로그인이 필요합니다.");
                router.push("/api/auth/signin");
            } else {
                setLoading(false);
            }
        });
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [])
    if (loading) return <p>로딩 중...</p>;
    return(
        <div className="p-20">
        <h4>글 작성</h4>
            <input type="text" name="title" placeholder="제목입력" onChange={(e) => {
                setTitle(e.target.value)
            }}/>
            <input type="text" name="content" placeholder="내용입력" onChange={(e) => {
                setContent(e.target.value)
            }}/>
            <input type="file" name="url" accept="image/*"  onChange={
                async (e) => {

                let file = e.target.files[0]
                if (!file) {
                    console.error("파일이 선택되지 않았습니다.");
                    return;
                }
                const objectURL = URL.createObjectURL(file);
                setPreview(objectURL);


                //한글 깨짐 방지하고 싶을 때
                let encodedFile = encodeURIComponent(file.name)

                let result = await fetch('api/post/write/presignedURL?file=' + encodedFile)
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
                    setSrc(업로드결과.url + '/' + encodedFile)
                } else {
                    console.log('실패')
                    }
                }}
                />
                {
                    preview ? <img src={preview} /> : ''
                }
            <button type="submit" onClick={() => {
                fetch('api/post/write/writePost',{
                    method : 'POST',
                    body : JSON.stringify({
                        title : title,
                        content : content,
                        src : src
                    }),
                })
                .then(()=>{
                    alert('글이 작성되었습니다.')
                    router.back()
                })
            }}>입력</button>
        </div>
    )
}