package model

import "fmt"

type person struct {
	Name string
	age  int
	sal  float64
}

// NewPerson 工厂模式函数
func NewPerson(name string) *person {
	return &person{
		Name: name,
	}
}

// 为了访问age和sel,写set和get方法
func (p *person) SetAge(age int) {
	if age > 0 && age < 150 {
		p.age = age
	} else {
		fmt.Println("年龄不正确")
	}
}

func (p *person) GetAge() int {
	return p.age
}

func (p *person) SetSal(sal float64) {
	if sal >= 3000 && sal <= 30000 {
		p.sal = sal
	} else {
		fmt.Println("薪水不正确")
	}
}

func (p *person) GetSal() float64 {
	return p.sal
}
