package services

import (
	"os"
	"fmt"
	"io/ioutil"
	"archive/zip"
)

type ZipService struct{}

func (this ZipService) Zip(path string, base string, w *zip.Writer) {
	files, _ := ioutil.ReadDir(fmt.Sprintf("/go/src/api/storage/%s", path))
	for _, file := range files {
		if file.IsDir() {
			this.Zip(fmt.Sprintf("%s/%s", path, file.Name()), fmt.Sprintf("%s/%s", base, file.Name()), w)
		} else {
			info, _ := os.Stat(fmt.Sprintf("/go/src/api/storage/%s/%s", path, file.Name()))
			hdr, _ := zip.FileInfoHeader(info)
			hdr.Name = fmt.Sprintf("%s/%s", base, file.Name())
			f, _ := w.CreateHeader(hdr)
			data, _ := ioutil.ReadFile(fmt.Sprintf("/go/src/api/storage/%s/%s", path, file.Name()))
			_, _ = f.Write(data)
		}
	}
}