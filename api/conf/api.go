package conf

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var (
	Host string
	User string
	Port string
	JwtSecretKey string
)

func init() {
	err := godotenv.Load("/go/src/api/.env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	Host = os.Getenv("HOST")
	User = os.Getenv("HOST_USER")
	Port = os.Getenv("HOST_PORT")

	JwtSecretKey = os.Getenv("JWT_SECRET_KEY")
}