package main

import "fmt"

type Person struct {
	Name string
	Age int
	Scores [5]float64
	ptr *int
	slice []int
	map1 map[string]string
}

func main() {
	var p1 Person
	fmt.Println(p1)
	fmt.Println(p1.map1 == nil)

	// 使用slice
	p1.slice = make([]int, 10)
	p1.slice[0] = 100
	fmt.Println(p1)

	// 使用map
	p1.map1 = make(map[string]string)
	p1.map1["key1"] = "tom~"
	fmt.Println(p1)

	// 不同结构体变量的字段是独立的，互不影响
	var monster1 Person
	monster1.Name = "牛魔王"
	monster1.slice = make([]int, 10)
	monster1.slice[0] = 122

	monster2 := monster1
	fmt.Println(monster1)
	fmt.Printf("%p\n", &monster1)
	fmt.Println(monster2)
	fmt.Printf("%p\n", &monster2)

	monster2.Name = "孙悟空"
	monster2.slice[0] = 123
	fmt.Println(monster1)
	fmt.Printf("%p\n", &monster1)
	fmt.Println(monster2)
	fmt.Printf("%p\n", &monster2)
}
