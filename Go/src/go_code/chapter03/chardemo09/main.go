package main

import "fmt"

// 演示golang中字符类型使用
func main() {
	var c1 byte = 'a'
	var c2 byte = '0'

	// 直接输出byte值，输出了ASCII中对应的十进制
	fmt.Println("c1=", c1) // 97
	fmt.Println("c2=", c2) // 48

	// 如果希望输出字符，需要使用fmt的格式化方法：Printf
	fmt.Printf("c1=%c c2=%c \n", c1, c2)

	// var c3 byte = '北'
	var c3 int = '北'
	fmt.Printf("c3=%c c3对应码值=%d \n", c3, c3)

	// 格式化输出数字，得到对应的UTF-8字符
	var c4 int = 22269 // 22269 -> 国
	fmt.Printf("c4=%c \n", c4)

	// 字符类型可以运算，按照UTF-8码值计算
	var n1 = 10 + 'a' // 10 + 97 = 107
	fmt.Println("n1=", n1)
}
