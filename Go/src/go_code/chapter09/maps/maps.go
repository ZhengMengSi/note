package main

import "fmt"

type Vertex struct {
	Lat, Long float64
}

var m map[string]Vertex

func main() {
	/*m = make(map[string]Vertex)
	m["Bell Labs"] = Vertex{
		40.68433, -74.39967,
	}
	fmt.Println(m["Bell Labs"])*/

	x := make(map[int]int)
	for i := 0; i < 5; i++ {
		x[i] = i
	}
	for k, v := range x {
		fmt.Println(k, v)
	}
}
