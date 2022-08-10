package main

import "fmt"

type AInterface interface {
	Say()
}

type Stu struct {
	Name string
}

func (stu Stu) Say() {
	fmt.Println("Stu Say()")
}

func main() {
	var stu Stu
	var a AInterface = stu
	a.Say()
}
