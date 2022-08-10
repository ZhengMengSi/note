package main

import (
	"time"
	"fmt"
)

func main() {
	curTime := time.Now()
	fmt.Println(curTime)
	unix := curTime.Unix()
	fmt.Println(unix)
}