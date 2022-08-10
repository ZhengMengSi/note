package main

import (
	"encoding/json"
	"fmt"
)

type a struct {
	Name string `json:"name"`
	Name1 string `json:"name1"`
	Age int `json:"age"`
}

func main() {
	d := make([]a, 0)
	str := `[{"name": "zhangsan","age": 2},{"name": "lisan","age": 3}]`
	err := json.Unmarshal([]byte(str), &d)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(d)
}

