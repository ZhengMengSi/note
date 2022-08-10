package main

import "fmt"

func main() {
	var arr [5]int = [...]int{11, 22, 21, 23, 33}
	maxVal := arr[1]
	maxValIndex := 0

	for i := 1; i < len(arr); i++ {
		if maxVal < arr[i] {
			maxVal = arr[i]
			maxValIndex = i
		}
	}
	fmt.Printf("maxVal=%v maxValIndex=%v", maxVal, maxValIndex)
}
