package main

import "fmt"

type Person struct {
	Name string
	Age int
}

func main() {
	// 方式1
	var p1 Person
	p1.Name = "tom"
	p1.Age = 18
	fmt.Println(p1)

	// 方式2
	p2 := Person{"mary", 20}
	// p2.Name = "tom"
	// p2.Age = 18
	fmt.Println(p2)

	// 方式3
	var p3 *Person = new(Person)
	// 因为p3是一个指针，因此标准的给字段赋值方式
	(*p3).Name = "smith"
	// (*p3).Name = "smith" 也可以这样写：p3.Name = "smith"
	// 原因：go的设计者为了程序员的使用方便，底层会对p3.Name = "smith"进行处理
	// 会给p3加上取值运算
	p3.Name = "john"
	(*p3).Age = 30
	fmt.Println(p3)

	// 方式4
	var p4 *Person = &Person{}
	p4.Name = "jjj"
	fmt.Println(p4)
}
