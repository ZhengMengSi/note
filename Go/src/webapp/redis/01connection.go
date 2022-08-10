package main

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
)

func main() {
	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:     "127.0.0.1:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	fmt.Println(rdb)

	/*pong, err := client.Ping(ctx).Result()
	fmt.Println(pong, err)*/

	val, err := rdb.Get(ctx, "k1").Result()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(val)
}
