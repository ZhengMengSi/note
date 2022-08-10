package main

import "fmt"

func main() {
	ages := make(map[int]int)

	ages[2] = 22
	ages[1] = 11

	fmt.Println(ages)
	for name, age := range ages {
		fmt.Printf("%d\t%d\n", name, age)
	}
}
