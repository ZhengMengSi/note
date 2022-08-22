package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func main() {
	dataSource := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8", "root", "root", "127.0.0.1", 3306, "gmserver")
	db1, err := sql.Open("mysql", dataSource)
	if err != nil {
		log.Fatal(err)
		return
	}
	err = db1.Ping()
	if err != nil {
		log.Fatal(err)
		return
	}
	sql := "select title from activity_gift;"
	rows, err := db1.Query(sql)
	defer rows.Close()
	if err != nil {
		fmt.Sprintf("%v", err)
		return
	}
	fmt.Sprintf("%v", rows)
	//
	/*	type Gift struct {
		Title string
	}
	var giftList []Gift
 	for rows.Next() {
		gift := Gift{}

		if err := rows.Scan(&gift.Title); err != nil {
			log.Fatal(err)
		}
		giftList = append(giftList, gift)
	}
	log.Printf("list：%v\n", giftList)*/


	type Gift struct {
		GiftID int
		Title string
	}
	var vals []interface{}
	giftList := []Gift{
		{1111129, "1"},
		{1111130, "1"},
	}
	sql = "replace into activity_gift(gift_id, title) values"
	for _, gi := range giftList {
		sql += "(?,?),"
		vals = append(vals, gi.GiftID, gi.Title)
	}
	sql = sql[0:len(sql)-1]
	stmt, _ := db1.Prepare(sql)
	r, e := stmt.Exec(vals...)
	log.Printf("stmt.Exec错误：%v", e)
	n, e := r.RowsAffected()
	log.Printf("影响行数：%v，r.RowsAffected错误：%v", n, e)
}
