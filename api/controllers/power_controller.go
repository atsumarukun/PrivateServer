package controllers

import (
	"fmt"
	"net/http"
	"io/ioutil"
	"golang.org/x/crypto/ssh"
	"github.com/gin-gonic/gin"

	"api/conf"
)

type PowerController struct{}

func (_ PowerController) Shutdown(c *gin.Context) {
	buf, err := ioutil.ReadFile("/go/src/api/PrivateServer")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	key, err := ssh.ParsePrivateKey(buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	config := &ssh.ClientConfig{
        User: conf.User,
        Auth: []ssh.AuthMethod{
			ssh.PublicKeys(key),
        },
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
    }
	client, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", conf.Host, conf.Port), config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	session, err := client.NewSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	defer session.Close()
	if err := session.Run("sudo shutdown -h now"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Shutdown.",
	})
}