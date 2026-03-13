package handlers

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"my-app-restrant/backend/config"
	"my-app-restrant/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

type MenuImageHandler struct {
	DB          *gorm.DB
	MinioClient *minio.Client
}

func NewMenuImageHandler(db *gorm.DB) *MenuImageHandler {
	minioClient, err := config.InitMinioClient()
	if err != nil {
		fmt.Printf("Failed to initialize MinIO client: %v\n", err)
		// 继续运行，但 MinIO 功能可能不可用
	}
	return &MenuImageHandler{DB: db, MinioClient: minioClient}
}

func (h *MenuImageHandler) GetAllMenuImages(c *gin.Context) {
	menuItemID := c.Query("menu_item_id")

	var images []models.MenuImage
	query := h.DB

	if menuItemID != "" {
		id, err := strconv.ParseUint(menuItemID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid menu_item_id"})
			return
		}
		query = query.Where("menu_item_id = ?", uint(id))
	}

	if err := query.Order("sorter ASC").Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, images)
}

func (h *MenuImageHandler) GetMenuImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var image models.MenuImage
	if err := h.DB.First(&image, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu image not found"})
		return
	}
	c.JSON(http.StatusOK, image)
}

func (h *MenuImageHandler) CreateMenuImage(c *gin.Context) {
	// 处理 multipart/form-data 格式的文件上传
	menuItemID, err := strconv.ParseUint(c.PostForm("menu_item_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid menu_item_id"})
		return
	}

	sorter, _ := strconv.Atoi(c.PostForm("sorter"))
	isPrimary, _ := strconv.ParseBool(c.PostForm("is_primary"))
	name := c.PostForm("name")

	// 获取上传的文件
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// 生成唯一文件名
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("menu_images/%s%s", uuid.New().String(), ext)

	// 上传到 MinIO
	var imageURL string
	if h.MinioClient != nil {
		_, err = h.MinioClient.PutObject(c, config.MinioBucket, filename, file, header.Size, minio.PutObjectOptions{
			ContentType: header.Header.Get("Content-Type"),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image to MinIO"})
			return
		}

		// 生成 MinIO 访问地址
		imageURL = fmt.Sprintf("http://%s/%s/%s", config.MinioEndpoint, config.MinioBucket, filename)
	} else {
		// 如果 MinIO 不可用，使用本地存储（仅用于开发）
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MinIO client not initialized"})
		return
	}

	// 创建 MenuImage 记录
	image := models.MenuImage{
		MenuItemID: uint(menuItemID),
		URL:        imageURL,
		Sorter:     sorter,
		IsPrimary:  isPrimary,
		Name:       name,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := h.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 如果是主图，更新 MenuItem 的 image_url
	if isPrimary {
		tx := h.DB.Begin()
		if err := tx.Model(&models.MenuItem{}).Where("id = ?", menuItemID).Update("image_url", image.ID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		tx.Commit()
	}

	c.JSON(http.StatusCreated, image)
}

func (h *MenuImageHandler) UpdateMenuImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var image models.MenuImage
	if err := h.DB.First(&image, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu image not found"})
		return
	}

	// 保存原始创建时间
	originalCreatedAt := image.CreatedAt

	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 处理 base64 格式的图片
	if image.URL != "" && strings.HasPrefix(image.URL, "data:image/") {
		// 提取 base64 数据
		base64Data := strings.Split(image.URL, ",")[1]
		data, err := base64.StdEncoding.DecodeString(base64Data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image data"})
			return
		}

		// 生成唯一文件名
		ext := strings.Split(image.URL, ";")[0]
		ext = strings.Split(ext, "/")[1]
		filename := fmt.Sprintf("menu_images/%s.%s", uuid.New().String(), ext)

		// 上传到 MinIO
		if h.MinioClient != nil {
			reader := bytes.NewReader(data)
			_, err = h.MinioClient.PutObject(c, config.MinioBucket, filename, reader, int64(len(data)), minio.PutObjectOptions{
				ContentType: fmt.Sprintf("image/%s", ext),
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image to MinIO"})
				return
			}

			// 更新 URL 为 MinIO 访问地址
			image.URL = fmt.Sprintf("http://%s/%s/%s", config.MinioEndpoint, config.MinioBucket, filename)
		}
	}

	// 保持原有创建时间
	image.CreatedAt = originalCreatedAt
	// 更新时间字段填充当前时间
	image.UpdatedAt = time.Now()

	if err := h.DB.Save(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

func (h *MenuImageHandler) DeleteMenuImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// 获取图片信息
	var image models.MenuImage
	if err := h.DB.First(&image, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu image not found"})
		return
	}

	// 从 MinIO 中删除文件
	if h.MinioClient != nil && image.URL != "" && strings.Contains(image.URL, config.MinioEndpoint) {
		// 提取文件路径
		parts := strings.Split(image.URL, "/")
		if len(parts) >= 4 {
			filename := parts[len(parts)-2] + "/" + parts[len(parts)-1]
			err = h.MinioClient.RemoveObject(c, config.MinioBucket, filename, minio.RemoveObjectOptions{})
			if err != nil {
				// 记录错误但继续删除数据库记录
				fmt.Printf("Failed to delete image from MinIO: %v\n", err)
			}
		}
	}

	if err := h.DB.Delete(&models.MenuImage{}, uint(id)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Menu image deleted successfully"})
}

func (h *MenuImageHandler) SetPrimaryImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var image models.MenuImage
	if err := h.DB.First(&image, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu image not found"})
		return
	}

	tx := h.DB.Begin()

	if err := tx.Model(&models.MenuImage{}).Where("menu_item_id = ?", image.MenuItemID).Update("is_primary", false).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Model(&image).Update("is_primary", true).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 更新 MenuItem 的 image_url 为当前主图的 ID
	if err := tx.Model(&models.MenuItem{}).Where("id = ?", image.MenuItemID).Update("image_url", image.ID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Primary image set successfully"})
}
