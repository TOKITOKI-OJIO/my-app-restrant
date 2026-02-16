package models

import (
	"time"

	"gorm.io/gorm"
)

type MenuItem struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Name        string         `gorm:"size:100;not null" json:"name"`
	Ingredients string         `gorm:"size:500" json:"ingredients"`
	Description string         `gorm:"size:500" json:"description"`
	Price       float64        `gorm:"not null" json:"price"`
	Category    string         `gorm:"size:50" json:"category"`
	ImageURL    string         `gorm:"size:500" json:"image_url"`
	Available   bool           `gorm:"default:true" json:"available"`
	Images      []MenuImage    `gorm:"foreignKey:MenuItemID" json:"images,omitempty"`
}
