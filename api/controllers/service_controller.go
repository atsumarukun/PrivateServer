package controllers

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/gin-gonic/gin"

	"api/services"
)

type ServiceController struct{}

func (_ ServiceController) Get(c *gin.Context) {
	type Service struct {
		Name string `json:Name"`
		Status string `json:Status"`
		ConfigFiles string `json:ConfigFiles"`
	}
	serv := services.SshService{}
	res, err := serv.Output("docker-compose ls -a --format json");
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	var data []Service;
	if err := json.Unmarshal(res, &data); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"services": data,
	})
}


func (_ ServiceController) Stop(c *gin.Context) {
	serv := services.SshService{}
	if err := serv.Run(fmt.Sprintf("cd %s && docker-compose stop", c.Query("path"))); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"path": c.Query("path"),
	})
}

func (_ ServiceController) Start(c *gin.Context) {
	serv := services.SshService{}
	if err := serv.Run(fmt.Sprintf("cd %s && docker-compose start", c.Query("path"))); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"path": c.Query("path"),
	})
}
