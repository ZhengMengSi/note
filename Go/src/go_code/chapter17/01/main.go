package main

import (
	"encoding/json"
	"fmt"
)

type Monster struct {
	Name string  `json:"monsterName"`
	Age  int     `json:"monsterAge"`
	Sal  float64 `json:"monsterSal"`
	Sex  string  `json:"monsterSex"`
}

func main() {
	m := Monster{
		Name: "玉兔精",
		Age:  20,
		Sal:  888.3,
		Sex:  "female",
	}
	data, _ := json.Marshal(m)
	fmt.Println(data)
	fmt.Println("json result=", string(data))
}
