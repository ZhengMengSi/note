package main

import "fmt"

func main() {
	pupil := &Pupil{}
	pupil.Student.Name = "tom"
	pupil.Student.Age = 8
	pupil.testing()
	pupil.Student.SetScore(10)
	pupil.Student.ShowInfo()
}

type Student struct {
	Name  string
	Age   int
	Score int
}

func (stu *Student) ShowInfo() {
	fmt.Printf("student name=%v age=%v score=%v", stu.Name, stu.Age, stu.Score)
}

func (stu *Student) SetScore(score int) {
	stu.Score = score
}

type Pupil struct {
	Student
}

func (p *Pupil) testing() {
	fmt.Println("小学生考试中")
}

type Graduate struct {
	Student
}

func (g *Graduate) testing() {
	fmt.Println("大学生考试中")
}
