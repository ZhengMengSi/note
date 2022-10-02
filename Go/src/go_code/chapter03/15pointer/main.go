package main

import (
	"fmt"
	"unsafe"
)

func main() {
	// 基本数据类型在内存中的布局
	var i int = 10
	fmt.Println("10在内存中的开始地址：", &i, "，存储大小：", unsafe.Sizeof(i), "，结束地址=开始地址+存储大小，i保存着开始地址，请问开始地址这一串字符又保存在哪？")

	// 1. ptr是一个指针变量
	// 2. ptr的类型是*int
	// 3. ptr本身的值是&i
	var ptr *int = &i
	fmt.Printf("ptr值=%v \n", ptr)
	fmt.Printf("ptr值地址=%v \n", &ptr)
	fmt.Printf("ptr值的值=%v \n", *ptr)
	fmt.Printf("ptr值的值地址=%v \n", &*ptr)

	/*var num int
	fmt.Println("num 地址=", &num)
	var ptr *int = &num
	*ptr = 10
	fmt.Println("num 值=", num)*/
}
