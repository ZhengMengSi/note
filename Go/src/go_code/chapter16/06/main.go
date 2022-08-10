package main

import (
	"fmt"
	"sync"
	"time"
)

var (
	myMap = make(map[int]uint64, 10)
	// 声明一个全局的互斥锁
	lock sync.Mutex
)

func test(n int) {
	var res uint64 = 1
	for i := 1; i <= n; i++ {
		res += uint64(i)
	}

	lock.Lock()
	myMap[n] = res
	lock.Unlock()
}

func main() {
	for i := 1; i <= 200; i++ {
		go test(i)
	}

	time.Sleep(time.Second * 10)

	/*for i, v := range myMap {
		fmt.Printf("map[%d]=%d \n", i, v)
	}*/

	for i := 0; i < len(myMap); i++ {
		fmt.Printf("map[%d]=%d \n", i, myMap[i])
	}
}
