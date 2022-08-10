package s

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestConnect(t *testing.T) {
	name := "mysql"
	password := "root:root@tcp(127.0.0.1:3306)/center_info?charset=utf8mb4&parseTime=True"
	_, err := Connect(name, password)
	t.Log(err, "连接信息")
}
