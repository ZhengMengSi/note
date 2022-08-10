package main

import (
	"fmt"
	"reflect"
)

func main() {
	// var num int = 100
	// reflectTest01(num)

	stu := Student{
		Name: "tome",
		Age:  20,
	}
	reflectTest02(stu)
}

func reflectTest01(b interface{}) {
	// 通过反射获取传入的变量的type和kind
	// 1.获取形参类型
	rTyp := reflect.TypeOf(b)
	fmt.Println("rType=", rTyp)

	// 2.获取形参值
	rVal := reflect.ValueOf(b)
	fmt.Println("rval=", rVal)

	n2 := 2 + rVal.Int()
	fmt.Println("n2=", n2)

	iV := rVal.Interface()
	fmt.Println(iV)
	num2 := iV.(int)
	fmt.Println("num2=", num2)
}

type Student struct {
	Name string
	Age  int
}

// 对结构体的反射
func reflectTest02(b interface{}) {
	rTyp := reflect.TypeOf(b)
	fmt.Println("rType=", rTyp)
	rVal := reflect.ValueOf(b)
	fmt.Println("rVal=", rVal)
	fmt.Println("rVal.kind=", rVal.Kind())
	iV := rVal.Interface()
	fmt.Println(iV)
	stu, ok := iV.(Student)
	if ok {
		fmt.Printf("stu.Name=%v \n", stu.Name)
	}
}
