package router

import (
	"github.com/gin-gonic/gin"
	"api/controllers"
)

func init() {
	r := Router()
	r.Static("/storage", "/go/src/api/storage")
	r.Run(":8000")
}

func Router() *gin.Engine {
	r := gin.Default()
	v := r.Group("/v1")
	{
		power := v.Group("/power")
		{
			ctrl := controllers.PowerController{}
			power.GET("/shutdown", ctrl.Shutdown)
		}
		storage := v.Group("/storage")
		{
			ctrl := controllers.StorageController{}
			storage.GET("/", ctrl.Get)
			storage.POST("/", ctrl.Upload)
			storage.PUT("/", ctrl.Rename)
			storage.DELETE("/", ctrl.Remove)
			storage.GET("/download", ctrl.Download)
			storage.POST("/create", ctrl.Create)
			storage.PUT("/move", ctrl.Move)
			storage.PUT("/copy", ctrl.Copy)
		}
		auth := v.Group("/auth")
		{
			ctrl := controllers.AuthController{}
			auth.POST("/", ctrl.Verification)
		}
		service := v.Group("/service")
		{
			ctrl := controllers.ServiceController{}
			service.GET("/", ctrl.Get)
		}
	}

	return r
}