package main

import "fmt"

type Student struct {
	Name string
	Age  int
}

// 给*Student实现方法String()
func (stu *Student) String() string {
	str := fmt.Sprintf("Name=[%v] Age=[%v]", stu.Name, stu.Age)
	return str
}

func main() {
	// 如果一个类型实现了String()这个方法，那么fmt.Println默认会调用这个变量的String()进行输出
	stu := Student{
		Name: "tom",
		Age:  20,
	}

	fmt.Println(&stu)
}
