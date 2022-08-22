package main

import (
	"database/sql"
	"fmt"
	"github.com/didi/gendry/manager"
	"github.com/didi/gendry/scanner"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/url"
)

func main() {
	var db *sql.DB
	var err error
	db, err = manager.New("gmserver", "root", "root", "127.0.0.1").Set(
		manager.SetCharset("utf8"),
		manager.SetParseTime(true),
		manager.SetLoc(url.QueryEscape("Asia/Shanghai"))).Port(3306).Open(true)
	if err != nil {
		log.Fatal(err)
	}

	type Gift struct {
		ID    int    `ddb:"gift_id"`
		Title string `ddb:"title"`
	}

	rows, _ := db.Query("select gift_id, title from activity_gift")
	var gifts []Gift
	err = scanner.Scan(rows, &gifts)
	for _, student := range gifts {
		fmt.Println(student)
	}
}
