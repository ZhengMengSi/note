package main

import "fmt"

type Person struct {
	Name string
}

func (p Person) speak() {
	fmt.Println(p.Name, "是一个goodman")
}

func (p Person) jisuan() {
	res := 0
	for i := 1; i <= 1000; i++ {
		res += i
	}
	fmt.Println(p.Name, "计算结果是=", res)
}

func (p Person) jisuan2(n int) {
	res := 0
	for i := 1; i <= n; i++ {
		res += i
	}
	fmt.Println(p.Name, "计算结果是=", res)
}

func (p Person) getSum(n1 int, n2 int) int {
	return n1 + n2
}

func main() {
	var p1 Person
	p1.Name = "张梦思"
	p1.speak()
	p1.jisuan()
	p1.jisuan2(2)
	res := p1.getSum(1, 2)
	fmt.Println("res=", res)
}
