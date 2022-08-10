package main

import "fmt"

func main() {
	a := [...]int{0, 1, 2, 3, 4, 5}
	reverse(a[:])
	fmt.Println(a)

	s := []int{0, 1, 2, 3, 4, 5}
	reverse(s[:2])
	fmt.Println(s)
	reverse(s[2:])
	fmt.Println(s)
	reverse(s)
	fmt.Println(s)

	var y []int
	fmt.Println(len(y), y, y == nil)
	y = nil
	fmt.Println(len(y), y, y == nil)
	y = []int(nil)
	fmt.Println(len(y), y, y == nil)
	y = []int{}
	fmt.Println(len(y), y, y == nil)
}

func reverse(s []int) {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
}
