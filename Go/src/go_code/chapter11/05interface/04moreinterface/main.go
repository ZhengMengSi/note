package main

import "fmt"

type AInterface interface {
	Say()
}

type BInterface interface {
	Hello()
}

type Monster struct {
}

func (m Monster) Hello() {
	fmt.Println("Monster Hello()")
}

func (m Monster) Say() {
	fmt.Println("Monster Say()")
}

func main() {
	var m Monster
	var a AInterface = m
	var b BInterface = m
	a.Say()
	b.Hello()
}
