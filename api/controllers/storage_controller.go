package controllers

import (
	"os"
	"fmt"
	"net/http"
	"io/ioutil"
	"github.com/gin-gonic/gin"
)

type StorageController struct{}

type File struct {
	Name string
	MimeType string
}

func (_ StorageController) Get(c *gin.Context) {
    files, err := ioutil.ReadDir(fmt.Sprintf("/go/src/api/storage/%s", c.Query("path")))
    if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
    }
	var fs []File
	for _, file := range files {
		if !file.IsDir() {
			bytes, err := os.ReadFile(fmt.Sprintf("/go/src/api/storage/%s/%s", c.Query("path"), file.Name()))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err,
				})
			}	
			fs = append(fs, File{file.Name(), http.DetectContentType(bytes)})
		} else {
			fs = append(fs, File{file.Name(), "dir"})
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"files": fs,
	})
}