package main

import "fmt"

// 演示golang中数据类型转换
func main() {
	// 不存在自动转换，都是强制转换
	var i int32 = 100
	var j float32 = float32(i)
	var k int8 = int8(i)
	var x int64 = int64(i)
	fmt.Printf("i=%v,j=%v,k=%v,x=%v \n", i, j, k, x)

	// 变量本身的数据类型和值没有变化
	fmt.Printf("i type is %T \n", i)

	// 高精度转低精度按溢出处理
	var num1 int64 = 999999    // 999999 => 1111 0100 0010 0011 1111
	var num2 int8 = int8(num1) // 0011 1111 => 63
	fmt.Printf("num2=%v", num2)
}
