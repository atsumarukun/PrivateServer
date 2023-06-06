package controllers

import (
	"fmt"
	"time"
	"net/http"
	"io/ioutil"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"github.com/dgrijalva/jwt-go"

	"api/conf"
)

type AuthController struct{}

func (_ AuthController) Verification(c *gin.Context) {
	type VerificationRequest struct {
		Password string `json:"password"`
	}
	var req VerificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	password, err := ioutil.ReadFile("/go/src/api/Password")
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	err = bcrypt.CompareHashAndPassword(password, []byte(req.Password))
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	claims := jwt.MapClaims{
		"verified": true,
		"exp": time.Now().Add(time.Hour * 1).Unix(),
	}
	jwt := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	token, err := jwt.SignedString([]byte(conf.JwtSecretKey))
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}