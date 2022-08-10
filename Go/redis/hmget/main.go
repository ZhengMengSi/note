package main

import (
	"fmt"
	"github.com/go-redis/redis/v8"
	"context"
	// "encoding/json"
)

var ctx = context.Background()

type ServerConst struct {
	NewServerDay string `redis:"newServerDay"`
	RecommendServerDay string `redis:"recommendServerDay"`
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})

	// val := map[string]interface{}{
	// 	"newServerDay": 2,
	// 	"newServerNum": 2,
	// }
	// err := rdb.HSet(ctx, "other:serverConst", val)
	// fmt.Println(err)

	// stringCmd := rdb.HGet(ctx, "other:serverConst", "newServerDay")
	// fmt.Println(stringCmd.Result())

	// val, err := rdb.HGetAll(ctx, "other:serverConst").Result()
	val := rdb.HGetAll(ctx, "other:serverConst")
	fmt.Printf("%T\n", val)
	// fmt.Printf("%T\n", err)
	// var sc ServerConst
	sc := ServerConst{
		NewServerDay: "6",
		RecommendServerDay: "7",
	}
	// err = json.Unmarshal([]byte(val), &sc)
	val.Scan(&sc)
	// fmt.Println(err)
	fmt.Printf("类型：%T\n值：%v", sc, sc)
}