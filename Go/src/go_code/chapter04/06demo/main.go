package xxx

import "fmt"

func main() {
	a := 100
	fmt.Printf("a的地址=%v \n", &a)

	var ptr *int = &a
	fmt.Printf("ptr的值=%v \n", *ptr)
}
