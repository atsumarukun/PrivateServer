package controllers

import (
	"os"
	"io"
	"fmt"
	"bytes"
	"strings"
	"net/http"
	"io/ioutil"
	"archive/zip"
	"github.com/gin-gonic/gin"

	"api/services"
)

type StorageController struct{}

func (_ StorageController) Get(c *gin.Context) {
	type File struct {
		Name string
		MimeType string
	}
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

func (_ StorageController) Upload(c *gin.Context) {
	file, err :=  c.FormFile("file")
	if  err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	c.SaveUploadedFile(file, fmt.Sprintf("/go/src/api/storage/%s/%s", c.Query("path"), file.Filename))
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}

func (_ StorageController) Download(c *gin.Context) {
	info, _ := os.Stat(fmt.Sprintf("/go/src/api/storage/%s", c.Query("key")))
	if info.IsDir() {
		b := new(bytes.Buffer)
		w := zip.NewWriter(b)
		serv := services.ZipService{}
		serv.Zip(c.Query("key"), info.Name(), w)
		_ = w.Close()
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s.zip", info.Name()))
		c.Data(http.StatusOK, "application/octet-stream", b.Bytes())
	} else {
		file, _ := os.ReadFile(fmt.Sprintf("/go/src/api/storage/%s", c.Query("key")))
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", info.Name()))
		c.Data(http.StatusOK, "application/octet-stream", file)
	}
}


func (_ StorageController) Create(c *gin.Context) {
	type CreateRequest struct {
		Name string `json:name"`
	}
	var req CreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	if err := os.Mkdir(fmt.Sprintf("/go/src/api/storage%s/%s", c.Query("path"), req.Name), 0777); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}

func (_ StorageController) Rename(c *gin.Context) {
	type RenameRequest struct {
		Key string `json:"key"`
	}
	var req RenameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	if err := os.Rename(fmt.Sprintf("/go/src/api/storage/%s", c.Query("key")), fmt.Sprintf("/go/src/api/storage/%s", req.Key)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}

func (_ StorageController) Remove(c *gin.Context) {
	type RemoveRequest struct {
		Keys []string `form:"keys[]"`
	}
	var req RemoveRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}

	for _, key := range req.Keys {
		if err := os.RemoveAll(fmt.Sprintf("/go/src/api/storage/%s", key)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}

func (_ StorageController) Move(c *gin.Context) {
	type MoveRequestQuery struct {
		Keys []string `form:"keys[]"`
	}
	var query MoveRequestQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	type MoveRequestBody struct {
		Path string `json:"path"`
	}
	var body MoveRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	for _, key := range query.Keys {
		fileName := key[strings.LastIndex(key, "/"):]
		if err := os.Rename(fmt.Sprintf("/go/src/api/storage/%s", key), fmt.Sprintf("/go/src/api/storage/%s/%s", body.Path, fileName)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}

func (_ StorageController) Copy(c *gin.Context) {
	type CopyRequestQuery struct {
		Keys []string `form:"keys[]"`
	}
	var query CopyRequestQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	type CopyRequestBody struct {
		Path string `json:"path"`
	}
	var body CopyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	var newFile io.Writer
	var err error
	for _, key := range query.Keys {
		fileName := key[strings.LastIndex(key, "/"):]
		if key[:strings.LastIndex(key, "/")] == body.Path[:strings.LastIndex(body.Path, "/")] {
			newFile, err = os.Create(fmt.Sprintf("/go/src/api/storage/%s/%s", body.Path, strings.Replace(fileName, ".", " copy.", 1)))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err,
				})			
			}
		} else {
			newFile, err = os.Create(fmt.Sprintf("/go/src/api/storage/%s/%s", body.Path, fileName))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err,
				})			
			}
		}
		oldFile, err := os.Open(fmt.Sprintf("/go/src/api/storage/%s", key))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})		
		}
		io.Copy(newFile, oldFile)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
	})
}
