package router

import (
	"github.com/gin-gonic/gin"
	"api/controllers"
)

func init() {
	r := Router()
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
	}

	return r
}