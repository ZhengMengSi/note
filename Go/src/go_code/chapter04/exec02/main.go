package main

import "fmt"

func main() {
	// 有两个变量a和b，要求将其进行交换，但是不允许使用中间变量
	var a int = 1
	var b int = 2

	a = a + b
	b = a - b
	a = a - b
	fmt.Println("a=", a, " b=", b)
}
