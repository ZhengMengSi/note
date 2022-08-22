package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func main() {
	driverName := "mysql"
	dataSourceName := "root:root@tcp(127.0.0.1:3306)/gmserver?charset=utf8mb4&parseTime=True"
	db, err := sql.Open(driverName, dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	q := `
		select gift_id, title
		from activity_gift
		where gift_id=?;
	`
	rows, err := db.Query(q, "6333")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	// 遍历结果集得到想到的值
	for rows.Next() {
		var (
			giftID int64
			title  string
		)
		// Scan后的参数和查询语句后的字段顺序、数量、类型要一致
		if err := rows.Scan(&giftID, &title); err != nil {
			log.Fatal(err)
		}
		log.Printf("giftID %d title is %s\n", giftID, title)
	}
}
