export default function SignUp() {
    return(
        <div>
            <h4>회원가입 페이지</h4>
            <form action="api/signUp" method="POST">
                <input type="text" name="id" placeholder="아이디"/>
                <input type= "password" name="password" placeholder="비밀번호"/>
                <input type= "password" name="passwordCheck" placeholder="비밀번호확인"/>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}