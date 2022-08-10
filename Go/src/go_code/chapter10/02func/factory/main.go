package main

import (
	"fmt"
	"go_code/chapter10/02func/model"
)

func main() {
	var stu = model.NewStudent("tom", 88.8)
	fmt.Println(*stu)
	fmt.Println("name=", stu.Name, "score=", stu.GetScore())
}
