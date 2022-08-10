package main

import (
	"fmt"
)

func main() {
	var a []string
	// var b []string
	fmt.Println(a == nil)
	fmt.Println(len(a))
	var b []string = nil
	fmt.Println(len(b))
}