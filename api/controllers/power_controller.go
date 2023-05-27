package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"

	"api/services"
)

type PowerController struct{}

func (_ PowerController) Shutdown(c *gin.Context) {
	serv := services.SshService{}
	if err := serv.Run("sudo shutdown -h now"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Shutdown.",
	})
}