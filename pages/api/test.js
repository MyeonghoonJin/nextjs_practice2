// 서버 역할하는 코드
//  
export default function Handler(요청,응답){
    let 현재날짜 = new Date()
    let 현재시간 = 현재날짜.toLocaleTimeString()
    if( 요청.method == "GET"){
        응답.status(200).json(현재시간)
    }
    
}