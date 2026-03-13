package config

import (
	"context"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// MinIO 配置
var (
	MinioEndpoint  = "123.56.20.210:9000"
	MinioAccessKey = "admin"
	MinioSecretKey = "YourStrongPwd2024!"
	MinioBucket    = "menu-image"
)

// InitMinioClient 初始化 MinIO 客户端
func InitMinioClient() (*minio.Client, error) {
	// 初始化 MinIO 客户端
	client, err := minio.New(MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(MinioAccessKey, MinioSecretKey, ""),
		Secure: false, // 如果使用 HTTPS，设置为 true
	})
	if err != nil {
		return nil, err
	}

	// 检查存储桶是否存在，不存在则创建
	exists, err := client.BucketExists(context.Background(), MinioBucket)
	if err != nil {
		return nil, err
	}

	if !exists {
		err = client.MakeBucket(context.Background(), MinioBucket, minio.MakeBucketOptions{})
		if err != nil {
			return nil, err
		}

		// 设置存储桶策略，允许公共访问
		policy := `{
			"Version": "2012-10-17",
			"Statement": [
				{
					"Action": ["s3:GetObject"],
					"Effect": "Allow",
					"Principal": {"AWS": ["*"]},
					"Resource": ["arn:aws:s3:::` + MinioBucket + `/menu_images/*"],
					"Sid": ""
				}
			]
		}`
		err = client.SetBucketPolicy(context.Background(), MinioBucket, policy)
		if err != nil {
			return nil, err
		}
	}

	return client, nil
}
