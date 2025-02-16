import { connectDB } from "@/util/database"
import bcryt from 'bcrypt'

export default async function Register(요청,응답) {
    
    if(요청.method == 'POST'){

        const client = await connectDB
        const db = await client.db("forum")


        let dupId = await db.collection('member').findOne({id:요청.body.id})
        let dupEmail = await db.collection('member').findOne({email:요청.body.email})

        //공백 처리
        for (let key in 요청.body){
            if(!요청.body[key]){
                return 응답.status(200).json('공백')
            }
        }
        //비밀번호 입력 동일 유무 확인
        if(요청.body.password != 요청.body.passwordCheck){
            return 응답.status(400).json("비밀번호 불일치")
        }

        delete 요청.body.passwordCheck

        //아이디또는 이메일 중복 유무
        if(dupId || dupEmail) {
            return 응답.status(400).json("아이디 또는 이메일 중복")
        }

        //비밀번호 암호화
        let hash = await bcryt.hash(요청.body.password, 10)
        요청.body.password = hash

        //role 설정(임의)
        if(요청.body.email == 'audgns1947@dgu.ac.kr'){
            요청.body.role = "admin";
        }
        else{
            요청.body.role = "normal";
        }
        let result = db.collection('member').insertOne(요청.body)
        응답.status(200).redirect('/register')
    }
}