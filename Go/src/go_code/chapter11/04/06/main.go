package main

type A struct {
	Name string
}

type B struct {
	Name string
}

type C struct {
	A
	B
}

type D struct {
	a A
}

func main() {
	var d D
	d.a.Name = "jjj"
}
