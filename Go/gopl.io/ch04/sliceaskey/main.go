package main

import "fmt"

var m = make(map[string]int)

func main() {
	s := []string{"zms"}
	// str := k(s)
	// fmt.Println(str)
	Add(s)
	fmt.Println(m)
	fmt.Println(Count(s))
}

func k(list []string) string {
	return fmt.Sprintf("%q", list)
}

func Add(list []string) {
	m[k(list)]++
}

func Count(list []string) int {
	return m[k(list)]
}
