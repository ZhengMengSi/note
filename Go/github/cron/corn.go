package main

import (
	"fmt"
	
	"github.com/robfig/cron/v3"
)

func main() {
	go func() {
		c := cron.New(cron.WithSeconds())
		// c.AddFunc("30 * * * *", func() {fmt.Println("Every hour on the half hour")})
		c.AddFunc("/3 * * * * *", func() {fmt.Println("Every hour on the half hour")})
		c.Start()
		select{}
		// time.Sleep(time.Second * 3)
	}()
}