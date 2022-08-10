package main

import (
	"net/http"
	"io"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"time"
	"fmt"
)

func main() {
	data := "1"
	contentType := "application/x-www-form-urlencoded;charset=utf-8"
	url := fmt.Sprintf("%s/PacketPost", "http://127.0.0.1:8888")
	result := Post(url, data, contentType)
	fmt.Println(result)
}

func Get(url string) (response string) {
	client := http.Client{Timeout: 5 * time.Second}
	resp, error := client.Get(url)
	defer resp.Body.Close()
	if error != nil {
		panic(error)
	}

	var buffer [512]byte
	result := bytes.NewBuffer(nil)
	for {
		n, err := resp.Body.Read(buffer[0:])
		result.Write(buffer[0:n])
		if err != nil && err == io.EOF {
			break
		} else if err != nil {
			panic(err)
		}
	}

	response = result.String()
	return
}

func Post(url string, data interface{}, contentType string) (content string) {
	jsonStr, _ := json.Marshal(data)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Add("content-type", contentType)
	if err != nil {
		panic(err)
	}

	defer req.Body.Close()

	client := &http.Client{Timeout: 5 * time.Second}
	resp, error := client.Do(req)
	if error != nil {
		panic(error)
	}

	defer resp.Body.Close()

	result, _ := ioutil.ReadAll(resp.Body)
	content = string(result)
	return
}
