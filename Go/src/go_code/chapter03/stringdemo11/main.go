package main

import "fmt"

// 演示golang中string类型使用
func main() {
	var address string = "上海浦东"
	fmt.Println("地址：", address)

	// 在Go中字符串不可变，字符串一旦被赋值，字符串就不能够再修改
	// var str = "hello"
	// str[0] = "w"

	// 字符串有两种表示形式：双引号和反引号
	str2 := "ab\nc"
	fmt.Println(str2)

	str3 := `
		package main

		import "fmt"
		
		// 演示golang中string类型使用
		func main() {
			var address string = "上海浦东"
			fmt.Println("地址：", address)
		
			// 在Go中字符串不可变，字符串一旦被赋值，字符串就不能够再修改
			// var str = "hello"
			// str[0] = "w"
		
			// 字符串有两种表示形式：双引号和反引号
			str2 := "ab\nc"
			fmt.Println(str2)
			
			
		}
	`
	fmt.Println(str3)

	// 字符串拼接
	str4 := "hello " + "world"
	str4 += "123"
	fmt.Println(str4)

	// 当一行字符串太长而需要换行时，将+保留到上一行
	str5 := "hello " + "zms" + "zys" +
		"zsd"
	fmt.Println(str5)

	var a int
	var b float32
	var c float64
	var isMarried bool
	var name string
	fmt.Printf("a=%d,b=%v,c=%v,isMarried=%v,name=%v", a, b, c, isMarried, name)
}
