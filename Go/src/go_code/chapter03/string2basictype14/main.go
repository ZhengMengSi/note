package main

import (
	"fmt"
	"strconv"
)

func main() {
	var str string = "true"
	var b bool
	b, _ = strconv.ParseBool(str)
	fmt.Printf("b type is %T, value is %v \n", b, b)

	var str1 string = "1"
	var i int64
	i, _ = strconv.ParseInt(str1, 10, 0)
	fmt.Printf("i type is %T, value is %v \n", i, i)

	var str2 string = "123.456"
	var f float64
	f, _ = strconv.ParseFloat(str2, 64)
	fmt.Printf("f type = %T, value = %v \n", f, f)

	// 字符串转基本类型如果失败，给它默认值
	var str3 string = "hello"
	var i1 int64
	i1, _ = strconv.ParseInt(str3, 10, 64)
	fmt.Printf("i1 type=%T value=%v \n", i1, i1)

	var b1 bool
	b1, _ = strconv.ParseBool(str1)
	fmt.Printf("b1 type=%T value=%v \n", b1, b1)
}
