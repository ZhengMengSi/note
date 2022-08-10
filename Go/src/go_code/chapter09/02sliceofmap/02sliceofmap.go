package main

import "fmt"

func main() {
	var monsters []map[string]string
	monsters = make([]map[string]string, 2)
	if monsters[0] == nil {
		monsters[0] = make(map[string]string, 2)
		monsters[0]["name"] = "牛魔王"
		monsters[0]["age"] = "500"
	}
	if monsters[1] == nil {
		monsters[1] = make(map[string]string, 2)
		monsters[1]["name"] = "玉兔精"
		monsters[1]["age"] = "400"
	}

	// 下面这个写法越界
	// if monsters[2] == nil {
	// 	monsters[2] = make(map[string]string, 2)
	// 	monsters[2]["name"] = "玉兔精"
	// 	monsters[2]["age"] = "400"
	// }

	// 利用append函数扩容切片
	newMonster := map[string]string{
		"name": "猪八戒",
		"age":  "3333",
	}
	monsters = append(monsters, newMonster)

	fmt.Println(monsters)
}
