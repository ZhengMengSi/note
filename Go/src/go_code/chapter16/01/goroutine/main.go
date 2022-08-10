package main

import (
	"fmt"
	"strconv"
	"time"
)

func test() {
	for i := 1; i <= 100; i++ {
		fmt.Println("协程" + strconv.Itoa(i))
		time.Sleep(time.Second)
	}
}

func main() {
	go test()
	go test()
	go test()
	go test()
	go test()
	go test()
	go test()
	go test()
	go test()

	for i := 1; i <= 100; i++ {
		fmt.Println("进程" + strconv.Itoa(i))
		time.Sleep(time.Second)
	}
}
