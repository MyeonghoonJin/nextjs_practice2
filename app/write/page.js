export default function Write(){
    return(
        <div className="p-20">
            <h4>글 작성</h4>
            <form action="api/write" method="POST">
                <input type="text" name="title" placeholder="제목입력" />
                <input type="text" name="content" placeholder="내용입력"/>
                <button type="submit">입력</button>
            </form>
        </div>
    )
}