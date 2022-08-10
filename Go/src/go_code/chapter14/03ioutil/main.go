package main

import (
	"fmt"
	"io/ioutil"
)

func main() {
	// 使用ioutil.ReadFile一次性将文件读取到位
	file := "D:\\zms\\study-go\\尚硅谷_韩顺平_Go语言核心编程.pdf"
	content, err := ioutil.ReadFile(file)
	if err != nil {
		fmt.Printf("read file err=%v", err)
	}

	// 把读取到的内容显示到终端
	fmt.Printf("%v", string(content))
}
