package main

import "fmt"

func main() {
	var intArr [5]int = [...]int{1, 22, 33, 44, 55}
	slice := intArr[1:3]
	fmt.Println("intarr=", intArr)
	fmt.Println("slice元素=", slice)
	fmt.Println("slice个数=", len(slice))
	fmt.Println("slice容量=", cap(slice))
}
