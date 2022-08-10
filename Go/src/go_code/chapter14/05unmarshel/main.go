package main

import (
	"encoding/json"
	"fmt"
)

type Monster struct {
	Name     string `json:"monster_name"`
	Age      int
	Birthday string
	Sal      float64
	Skill    string
}

func unmarshalStruct() {
	str := "{\"monster_name\":\"牛魔王\",\"Age\":500,\"Birthday\":\"2011-11-11\",\"Sal\":8000,\"Skill\":\"牛魔拳\"}"

	var monster Monster
	err := json.Unmarshal([]byte(str), &monster)
	if err != nil {
		fmt.Printf("unmarshal err=%v \n", err)
	}
	fmt.Printf("反序列化后 monster=%v monster.Name=%v \n", monster, monster.Name)
}

func unmarshalSlice() {
	str := "[{\"address\":\"北京\",\"age\":7,\"name\":\"jack\"},{\"address\":\"北京2\",\"age\":72,\"name\":\"jack2\"}]"
	var slice []map[string]interface{}
	err := json.Unmarshal([]byte(str), &slice)
	if err != nil {
		fmt.Printf("unmarshal err=%v \n", err)
	}
	fmt.Printf("反序列化后 slice=%v \n", slice)
}

func main() {
	unmarshalStruct()
	unmarshalSlice()
}
