package main

import (
	"fmt"
	"unsafe"
)

func main() {
	type Cat struct {
		Name string
		Age int
		Color string
	}

	var cat1 Cat
	fmt.Printf("cat1的地址=%p\n", &cat1)
	fmt.Printf("cat1.Name的地址=%p\n", &cat1.Name)
	fmt.Printf("cat1.Name的大小=%d\n", unsafe.Sizeof(cat1.Name))
	fmt.Printf("cat1.Name的地址=%p\n", &cat1.Age)

	cat1.Name = "小白"
	cat1.Age = 3
	cat1.Color = "白色"
	fmt.Println(cat1)
}
