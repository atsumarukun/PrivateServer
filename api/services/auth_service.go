package services

import (
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/dgrijalva/jwt-go"

	"api/conf"
)

type AuthService struct{}

func (_ AuthService) Guard(c *gin.Context) bool {
	authorization := c.Request.Header.Get("Authorization")
	token, err := jwt.Parse(authorization[strings.Index(authorization, " ") + 1:], func(token *jwt.Token) (interface{}, error) {
        return []byte(conf.JwtSecretKey), nil
    })
	if err != nil {
		return false
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["verified"].(bool)
	} else {
		return false
	}
}