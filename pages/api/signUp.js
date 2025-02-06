import { connectDB } from "@/util/database"

export default async function SignUp(요청,응답) {
    
    const client = await connectDB
    const db = await client.db("forum")

    let 입력값 = 요청.body

    let dupId = await db.collection('member').findOne({id:입력값.id})
    
    //비밀번호 입력 동일 유무 확인
    if(입력값.password != 입력값.passwordCheck){
        return 응답.status(400).json("비밀번호 불일치")
    }
    //아이디 중복 유무
    if(dupId) {
        return 응답.status(400).json("아이디 중복")
    }
    let result = db.collection('member').insertOne({id:입력값.id , password:입력값.password})
    응답.status(200).redirect('/signUp')
}