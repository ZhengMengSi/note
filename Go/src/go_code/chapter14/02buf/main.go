package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

func main() {
	file, err := os.Open("D:\\zms\\study-go\\src\\go_code\\chapter14\\ActQuestionnaire.json")
	if err != nil {
		fmt.Println("open file err=", err)
	}

	defer file.Close()

	reader := bufio.NewReader(file)
	for {
		str, err := reader.ReadString('\n')
		if err == io.EOF {
			break
		}
		fmt.Print(str)
	}
	fmt.Println("文件读取结束")
}
