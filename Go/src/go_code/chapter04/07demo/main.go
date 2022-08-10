package main

// 068_获取用户终端输入
func main() {
	/*var name string
	var age byte
	var sal float32
	var isPass bool*/

	// 方式一：fmt.Scanln，以换行为输入结束标记
	/*fmt.Println("请输入姓名：")
	fmt.Scanln(&name)
	fmt.Println("请输入年龄：")
	fmt.Scanln(&age)
	fmt.Println("请输入薪水：")
	fmt.Scanln(&sal)
	fmt.Println("请输入通过与否：")
	fmt.Scanln(&isPass)
	fmt.Printf("姓名：%v, 年龄：%v, 薪水：%v, 通过与否：%v", name, age, sal, isPass)*/

	// 方式二：fmt.Scanf，以指定的符号作为结束标记
	/*fmt.Println("请输入姓名、年龄、薪水和通过与否，用空格隔开")
	fmt.Scanf("%s %d %f %t", &name, &age, &sal, &isPass)
	fmt.Printf("姓名：%v, 年龄：%v, 薪水：%v, 通过与否：%v", name, age, sal, isPass)*/
}
