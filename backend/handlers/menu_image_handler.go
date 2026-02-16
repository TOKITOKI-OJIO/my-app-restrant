package handlers

import (
	"net/http"
	"strconv"

	"my-app-restrant/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MenuImageHandler struct {
	DB *gorm.DB
}

func NewMenuImageHandler(db *gorm.DB) *MenuImageHandler {
	return &MenuImageHandler{DB: db}
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
	var image models.MenuImage
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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

	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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
	
	tx.Commit()
	
	c.JSON(http.StatusOK, gin.H{"message": "Primary image set successfully"})
}
