package main

import (
	"fmt"
	"unsafe"
)

// 演示golang中bool类型使用
func main() {
	var b bool = false
	fmt.Println("b=", b)
	// 注意事项：
	// 1.bool类型的存储空间是1byte
	fmt.Println("b 占用的空间：", unsafe.Sizeof(b))
}
