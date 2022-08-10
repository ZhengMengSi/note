package main

import "fmt"

func main() {
	// 数组创建后，如果没有赋值，有默认值
	// 1. 数值（整数和浮点数）=> 0
	// 2. 字符串 => ""
	// 3. 布尔类型 => false
	/*var arr01 [3]float32
	var arr02 [3]int
	var arr03 [3]string
	var arr04 [3]bool
	fmt.Printf("arr01=%v arr02=%v arr03=%v arr04=%v", arr01, arr02, arr03, arr04)*/

	arr := [3]int{11, 22, 33}
	test(&arr)
	fmt.Println(arr)
}

func test(arr *[3]int) {
	arr[0] = 88
}
