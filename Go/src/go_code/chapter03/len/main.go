package main

import "fmt"

func main() {
	s := "hello, world"
	fmt.Println(len(s))     // 12
	fmt.Println(s[0], s[7]) // 104 119
	fmt.Println(s[0:12])

	c := "梦"
	fmt.Println(len(c)) // 3
	fmt.Println(c[2])
	fmt.Println(c[0:1])
	fmt.Println(c[1:2])
}
