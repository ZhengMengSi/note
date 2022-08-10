package main

import "fmt"

type Student struct {
	Name  string
	Age   int
	Score int
}

func (stu *Student) ShowInfo() {
	fmt.Printf("姓名：%v, age=%v, score=%v", stu.Name, stu.Age, stu.Score)
}

func (stu *Student) SetScore(score int) {
	stu.Score = score
}

type Pupil struct {
	Student
}

func (p *Pupil) testing() {
	fmt.Println("小学生正在考试")
}

type Graduate struct {
	Student
}

func (g *Graduate) testing() {
	fmt.Println("大学生正在考试")
}

func main() {
	pupil := &Pupil{}
	pupil.Student.Name = "tom"
	pupil.Student.Age = 18
	// pupil.Student.Score = 60
	pupil.Student.SetScore(70)
	pupil.Student.ShowInfo()
}
