package models

import (
	"time"

	"gorm.io/gorm"
)

type MenuImage struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	MenuItemID uint           `gorm:"not null;index" json:"menu_item_id"`
	MenuItem   MenuItem       `gorm:"foreignKey:MenuItemID" json:"menu_item,omitempty"`
	URL        string         `gorm:"type:text;not null" json:"url"`
	Sorter     int            `gorm:"default:0" json:"sorter"`
	IsPrimary  bool           `gorm:"default:false" json:"is_primary"`
	Name       string         `gorm:"size:100" json:"name"`
}
