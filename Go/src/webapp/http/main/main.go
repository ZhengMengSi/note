package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func get() {
	r, err := http.Get("http://httpbin.org/get")
	if err != nil {
		panic(err)
	}
	defer func() { _ = r.Body.Close() }()
	content, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s", content)
}

func post() {
	r, err := http.Post("http://httpbin.org/post", "", nil)
	if err != nil {
		panic(err)
	}
	defer func() { _ = r.Body.Close() }()
	content, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s", content)
}

func main() {
	post()
}
