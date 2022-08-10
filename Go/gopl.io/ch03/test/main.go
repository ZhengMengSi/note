package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Println(math.MaxFloat32)

	var f float32 = 16777216
	fmt.Println(f == f+1) // true

	fmt.Println(math.MaxFloat32 > f)

	for x := 0; x < 8; x++ {
		fmt.Printf("x=%d ex=%8.3f\n", x, math.Exp(float64(x)))
	}
}
