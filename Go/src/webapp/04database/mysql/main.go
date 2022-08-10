package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

var (
	Db  *sql.DB
	err error
)

func init() {
	Db, err = sql.Open("mysql", "root:root@tcp(localhost:3306)/center_info")
	if err != nil {
		panic(err.Error())
	}
}

func main() {
	fmt.Println(Db)
}
