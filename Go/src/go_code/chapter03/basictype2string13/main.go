package main

import (
	"fmt"
	"strconv"
)

func main() {
	var num1 int = 99
	var num2 float64 = 12.33
	var b bool = false
	var c byte = 'a'
	var s string

	// fmt.Sprintf
	s = fmt.Sprintf("%d", num1)
	fmt.Printf("s type is %T, value is %q \n", s, s)

	s = fmt.Sprintf("%f", num2)
	fmt.Printf("s type is %T, value is %q \n", s, s)

	s = fmt.Sprintf("%t", b)
	fmt.Printf("s type is %T, value is %q \n", s, s)

	s = fmt.Sprintf("%c", c)
	fmt.Printf("s type is %T, value is %q \n", s, s)

	// strconv
	var num3 int = 99
	var num4 float64 = 12.33
	s = strconv.FormatInt(int64(num3), 10)
	fmt.Printf("s type is %T, value is %q \n", s, s)
	s = strconv.FormatFloat(num4, 'f', 10, 64)
	fmt.Printf("s type is %T, value is %q \n", s, s)
}
