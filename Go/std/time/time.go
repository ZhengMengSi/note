package main

import (
	"fmt"
	"time"
)

func main() {
	// 此刻
	curTime := time.Now()
	fmt.Println(curTime)
	unix := curTime.Unix()
	fmt.Println(unix)

	// 昨天
	yesterday := time.Now().AddDate(0, 0, -1)
	fmt.Println(yesterday)
	//str := yesterday.Format("2006-01-02 15:04:05")
	str := yesterday.Format("2006-01-02")
	fmt.Println(str)
}
