package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Total     float64        `gorm:"not null" json:"total"`
	Status    string         `gorm:"size:20;default:'pending'" json:"status"`
	Address   string         `gorm:"size:255" json:"address"`
	Phone     string         `gorm:"size:20" json:"phone"`
	Items     []OrderItem    `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

type OrderItem struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	OrderID   uint           `gorm:"not null;index" json:"order_id"`
	Order     Order          `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	MenuItem  MenuItem       `gorm:"foreignKey:MenuItemID" json:"menu_item,omitempty"`
	MenuItemID uint          `gorm:"not null" json:"menu_item_id"`
	Quantity  int            `gorm:"not null" json:"quantity"`
	Price     float64        `gorm:"not null" json:"price"`
}
