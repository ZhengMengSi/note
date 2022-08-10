package package_level_variables

var a = b + c
var b = f()
var c = 1

func f() int {
	return c + 1
}
