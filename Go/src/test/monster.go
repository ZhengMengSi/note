package test

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type Monster struct {
	Name  string
	Age   int
	Skill string
}

func (m Monster) Store() bool {
	data, err := json.Marshal(m)
	if err != nil {
		fmt.Println("marshal err=", err)
		return false
	}

	filePath := "D:/zms/code/study-go/src/go_code/basic/monster.ser"
	err = ioutil.WriteFile(filePath, data, 0666)
	if err != nil {
		fmt.Println("write file err=", err)
		return false
	}
	return true
}
