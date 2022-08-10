package main

import "fmt"

func main() {
	var arr [3]int = [...]int{11, 22, 33}
	sum := 0
	for _, val := range arr {
		sum += val
	}
	fmt.Printf("sum=%v average=%v", sum, float64(sum)/float64(len(arr)))
}
