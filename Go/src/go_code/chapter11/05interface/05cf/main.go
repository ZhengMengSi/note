package main

import "fmt"

type AInterface interface {
	Test01()
	Test02()
}

type BInterface interface {
	Test01()
	Test03()
}

type C interface {
	AInterface
	BInterface
}

type Stu struct {
}

func (s Stu) Test01() {

}
func (s Stu) Test02() {

}
func (s Stu) Test03() {

}

func main() {
	stu := Stu{}
	var c C = stu
	fmt.Println(c)
}
