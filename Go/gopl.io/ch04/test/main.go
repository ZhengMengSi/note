package main

import "fmt"

func main() {
	/*var a [3]int // 声明数组后，数组元素就存在了
	fmt.Println(a[0])
	fmt.Println(a[len(a) - 1])

	for i, v := range a {
		fmt.Printf("%d %d\n", i, v)
	}

	var r [3]int = [3]int{1,2} // 数组字面量
	fmt.Println(r[2])

	//var q [3]int = [3]int{1,2,3}
	q := [...]int{1,2,3}
	fmt.Printf("%T\n", q)

	type Currency int
	const (
		USD Currency = iota
		EUR
		GBP
		RMB
	)
	symbol := [...]string{USD: "$", EUR: "€", GBP: " £", RMB: "￥"}
	fmt.Println(RMB, symbol[RMB])*/

	//a := [2]int{1,2}
	//b := [...]int{1,2}
	//c := [2]int{1,3}
	//fmt.Println(a==b, a==c, b==c)
	//d := [3]int{1,2}
	//fmt.Println(a==d)

	//e := [32]byte{1,2}
	//zero(&e)
	//fmt.Printf("%x %d", e, cap(e))

	/*months := [...]string{
		1: "January",
		2: "February",
		3: "March",
		4: "April",
		5: "May",
		6: "June",
		7: "July",
		8: "August",
		9: "September",
		10: "October",
		11: "November",
		12: "December",
	}

	Q2 := months[4:7]
	summer := months[6:9]
	fmt.Printf("%d %d %d %d\n", len(Q2), cap(Q2), len(summer), cap(summer))
	fmt.Printf("%s\n", summer)

	//fmt.Println(summer[:20])
	endlessSummer := summer[:5]
	fmt.Printf("%s\n", endlessSummer)*/

	var s []int
	fmt.Printf("%d %v %v\n", len(s), s, nil)
	s = nil
	fmt.Printf("%d %v %v", len(s), s, nil)
}

func zero(ptr *[32]byte) {
	//for i := range ptr {
	//	ptr[i] = 0
	//}
	*ptr = [32]byte{}
}

func equal(x, y []string) bool {
	if len(x) != len(y) {
		return false
	}
	for i := range x {
		if x[i] != y[i] {
			return false
		}
	}
	return true
}
