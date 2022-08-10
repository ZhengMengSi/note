package main

import "fmt"

type AInterface interface {
	Say()
}

type integer int

func (i integer) Say() {
	fmt.Println("integer say i=", i)
}

func main() {
	var i integer = 10
	var b AInterface = i
	b.Say()
}
