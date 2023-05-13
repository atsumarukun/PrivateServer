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
		p := v.Group("/power")
		{
			ctrl := controllers.PowerController{}
			p.GET("/shutdown", ctrl.Shutdown)
		}
		s := v.Group("/storage")
		{
			ctrl := controllers.StorageController{}
			s.GET("/", ctrl.Get)
			s.PUT("/", ctrl.Rename)
			s.DELETE("/", ctrl.Remove)
			s.PUT("/copy", ctrl.Copy)
		}
	}

	return r
}