package main

import "fmt"

func main() {
	/*var n1 int32 = 12
	var n2 int8
	var n3 int64
	n2 = int8(n1 + 10)
	n3 = int64(n1 + 10)
	fmt.Println("n2=", n2, "n3=", n3)*/

	var n1 int32 = 12
	var n2 int8
	var n3 int8
	n2 = int8(n1) + 127 // 编译通过
	// n3 = int8(n1) + 128 // 编译不通过
	fmt.Println("n2=", n2, "n3=", n3)
}
