package main

import (
	"fmt"
	"go_code/chapter11/model"
)

func main() {
	account := model.NewAccount("zms123", "123456", 126.3)
	if account != nil {
		fmt.Println("success=", account)
	} else {
		fmt.Println("fail")
	}
}
