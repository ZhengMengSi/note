package main

import (
	"encoding/json"
	"fmt"
)

type Monster struct {
	Name  string `json:"name"`
	Age   int    `json:"age"`
	Skill string `json:"skill"`
}

func main() {
	monster := Monster{"牛魔王", 500, "芭蕉扇"}

	jsonStr, err := json.Marshal(monster)
	if err != nil {
		fmt.Println("json 处理错误", err)
	}
	fmt.Println("jsonStr", string(jsonStr))
}
