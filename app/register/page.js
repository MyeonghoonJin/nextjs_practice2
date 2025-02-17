export default function Register() {
    return(
        <div>
            <h4>회원가입 페이지</h4>
            <form action="api/auth/register" method="POST">
                <input name="email" type="text" placeholder="이메일" />
                <input type="text" name="id" placeholder="아이디"/>
                <input type="text" name="name" placeholder="이름"/>
                <input type= "password" name="password" placeholder="비밀번호"/>
                <input type= "password" name="passwordCheck" placeholder="비밀번호확인"/>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}