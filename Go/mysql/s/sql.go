package s

import (
	"database/sql"
	"log"
)

func Connect(name, password string) (db *sql.DB, err error) {
	db, err = sql.Open(name, password)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	return
}
