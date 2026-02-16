package models

type Category struct {
	ID   uint   `gorm:"primarykey" json:"id"`
	Name string `gorm:"size:100;not null" json:"name"`
}
