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

func testStruct() {
	monster := Monster{
		Name:     "牛魔王",
		Age:      500,
		Birthday: "2011-11-11",
		Sal:      8000.0,
		Skill:    "牛魔拳",
	}

	// 将monster序列化
	data, err := json.Marshal(&monster)
	if err != nil {
		fmt.Printf("序列化错误 err=%v \n", err)
	}
	fmt.Printf("monster序列化后=%v \n", string(data))
}

func testMap() {
	var a map[string]interface{}
	a = make(map[string]interface{})
	a["name"] = "红孩儿"
	a["age"] = 30
	a["address"] = "洪崖洞"
	data, err := json.Marshal(a)
	if err != nil {
		fmt.Printf("序列化错误 err=%v \n", err)
	}
	fmt.Printf("a map 序列化后=%v \n", string(data))
}

func testSlice() {
	var slice []map[string]interface{}
	var m1 map[string]interface{}
	m1 = make(map[string]interface{})
	m1["name"] = "jack"
	m1["age"] = 7
	m1["address"] = "北京"
	slice = append(slice, m1)

	var m2 map[string]interface{}
	m2 = make(map[string]interface{})
	m2["name"] = "jack2"
	m2["age"] = 72
	m2["address"] = "北京2"
	slice = append(slice, m2)

	data, err := json.Marshal(slice)
	if err != nil {
		fmt.Printf("序列化错误 err=%v \n", err)
	}
	fmt.Printf("a map 序列化后=%v \n", string(data))
}

func testFloat64() {
	var num1 float64 = 23456.67
	data, err := json.Marshal(num1)
	if err != nil {
		fmt.Printf("序列化错误 err=%v \n", err)
	}
	fmt.Printf("a map 序列化后=%v \n", string(data))
}

func main() {
	testStruct()
	testMap()
	testSlice()
	testFloat64()
}
