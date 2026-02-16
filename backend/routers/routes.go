package routers

import (
	"my-app-restrant/backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	api := r.Group("/api/v1")
	{
		menuHandler := handlers.NewMenuHandler(db)
		api.GET("/menu", menuHandler.GetAllMenuItems)
		api.GET("/menu/:id", menuHandler.GetMenuItem)
		api.POST("/menu", menuHandler.CreateMenuItem)
		api.PUT("/menu/:id", menuHandler.UpdateMenuItem)
		api.DELETE("/menu/:id", menuHandler.DeleteMenuItem)

		menuImageHandler := handlers.NewMenuImageHandler(db)
		api.GET("/menu-images", menuImageHandler.GetAllMenuImages)
		api.GET("/menu-images/:id", menuImageHandler.GetMenuImage)
		api.POST("/menu-images", menuImageHandler.CreateMenuImage)
		api.PUT("/menu-images/:id", menuImageHandler.UpdateMenuImage)
		api.DELETE("/menu-images/:id", menuImageHandler.DeleteMenuImage)
		api.PUT("/menu-images/:id/set-primary", menuImageHandler.SetPrimaryImage)

		orderHandler := handlers.NewOrderHandler(db)
		api.GET("/orders", orderHandler.GetAllOrders)
		api.GET("/orders/:id", orderHandler.GetOrder)
		api.POST("/orders", orderHandler.CreateOrder)
		api.PUT("/orders/:id", orderHandler.UpdateOrder)
		api.DELETE("/orders/:id", orderHandler.DeleteOrder)

		userHandler := handlers.NewUserHandler(db)
		api.GET("/users", userHandler.GetAllUsers)
		api.GET("/users/:id", userHandler.GetUser)
		api.POST("/users", userHandler.CreateUser)
		api.PUT("/users/:id", userHandler.UpdateUser)
		api.DELETE("/users/:id", userHandler.DeleteUser)
	}
}
