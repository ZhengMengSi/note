package main

import "fmt"

type Person struct {
	Name   string
	Age    int
	Scores [5]float64
	ptr    *int
	slice  []int
	map1   map[string]string
}

func main() {
	var p1 Person
	fmt.Println(p1)

	if p1.ptr == nil {
		fmt.Println("指针为空")
	}

	if p1.map1 == nil {

	}
}
