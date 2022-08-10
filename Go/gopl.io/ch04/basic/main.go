package main

import "fmt"

func main() {
	var ages map[string]int
	fmt.Println(ages == nil) // map不可比较，唯一合法的比较就是和nil做比较
	fmt.Println(len(ages))

	// ages["zms"] = 15 // panic: assignment to entry in nil map

	if age, ok := ages["bob"]; !ok {
		fmt.Printf("bob不是map中的键，age的值是：%v \n", age)
	}

	ages = map[string]int{
		"zms": 26,
		"zmm": 30,
	}
	ages1 := map[string]int{
		"zms": 26,
		"zmm": 30,
		"zml": 30,
	}
	fmt.Println(equal(ages, ages1))
}

func equal(x, y map[string]int) bool {
	if len(x) != len(y) {
		return false
	}

	for k, xv := range x {
		if yv, ok := y[k]; !ok || xv != yv {
			return false
		}
	}

	return true
}
