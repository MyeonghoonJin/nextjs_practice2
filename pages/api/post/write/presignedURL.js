import aws from 'aws-sdk'
export default async function PresignedURL(요청,응답){

    if(요청.method != 'GET'){
        return 응답.status(405).json({ error: "잘못된 메소드 요청" });
    }

    console.log(요청.query.file)

    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: 'ap-northeast-2',
        signatureVersion: 'v4',
      })
  
      const s3 = new aws.S3();
      //presignedURL 
      const url = await s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: { key : 요청.query.file },
        Expires: 60, // seconds
        Conditions: [
          ['content-length-range', 0, 1048576], //파일용량 1MB 까지 제한
        ],
      })
  
      응답.status(200).json(url)
  

}