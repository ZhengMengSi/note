package main

import "fmt"

func main() {
	var days int = 97
	fmt.Printf("%v个星期零%v天 \n", days/7, days%7)

	var d float32 = 110
	var s float32 = 5.0 / 9 * (d - 100)
	fmt.Printf("%v的华氏温度对应的摄氏温度=%v", d, s)
}
