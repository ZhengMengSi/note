package main

import "fmt"

func main() {
	var intChan chan int
	intChan = make(chan int, 3)

	fmt.Printf("%v \n", &intChan)

	intChan <- 10
	num := 211
	intChan <- num
	intChan <- 50
	//intChan <- 98

	fmt.Printf("len=%v cap=%v \n", len(intChan), cap(intChan))

	num3 := <-intChan
	num4 := <-intChan
	num5 := <-intChan

	fmt.Printf("num3=%v num4=%v num5=%v", num3, num4, num5)
}
