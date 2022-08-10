package main

func main() {

}

func appendInt(x []int, y int) []int {
	var z []int
	zlen := len(x) + 1
	if zlen <= cap(x) {
		z = x[:zlen]
	} else {
		zcap := zlen
		if zcap < 2*len(x) {
			zcap = 2 * len(x)
		}
		z = make([]int, zlen, zcap)
	}
	z[len(x)] = y
	return z
}

func mapAppendIsError() {
	var m map[string]string{}
	m["zms"] = "正确"
	// m = append(m, map["a"][])
}
