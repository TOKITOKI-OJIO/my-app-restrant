
前端   react + webpack

后端 go gorm


图片存储minio 
docker pull minio/minio:latest

docker run -d \
 --name minio-server \
 -p 9000:9000 \
 -p 9001:9001 \
 -e MINIO_ROOT_USER=admin \
 -e MINIO_ROOT_PASSWORD=YourStrongPwd2024! \
 -v /data/minio:/data \
 --restart unless-stopped \
 minio/minio server /data --console-address ":9001"

 注意：确保 /data/minio 是本地持久化存储路径。

endpoint := "123.56.20.210:9000" // MinIO 服务地址
accessKey := "your-access-key" // 访问密钥
secretKey := "your-secret-key" // 密钥