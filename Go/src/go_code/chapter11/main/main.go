package main

import (
	"fmt"
	"go_code/chapter11/model"
)

func _main() {
	p := model.NewPerson("smith")
	p.SetAge(18)
	p.SetSal(5000)
	fmt.Println(p)
	fmt.Println(p.Name, " age=", p.GetAge(), "sal=", p.GetSal())
}
