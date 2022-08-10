package main

import (
	// "github/redis/pkg/redis"
	"context"
	"github.com/go-redis/redis/v8"
	"fmt"
)

var ctx = context.Background()

func main() {
	// redis.ExampleClient()
	// redis1.NewRedisClient()

	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "zms123456",
		DB: 1,
	})

	err := rdb.Set(ctx, "name", "zms", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := rdb.Get(ctx, "name").Result()
	fmt.Println(val)
	if err != nil {
		panic(err)
	}
}