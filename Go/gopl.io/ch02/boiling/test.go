package main

import "fmt"

func init() {
	fmt.Println("同一个包不同文件")
}

func test() {
	fmt.Println(boilingF)
}
