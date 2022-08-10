package main

import (
	"fmt"
	"os"
)

func main() {
	file, err := os.Open("D:\\zms\\study-go\\src\\go_code\\chapter14\\ActQuestionnaire.json")
	if err != nil {
		fmt.Println("open file err=", err)
	}

	fmt.Printf("file=%v \n", file)

	err = file.Close()
	if err != nil {
		fmt.Println("close file err=", err)
	}
}
