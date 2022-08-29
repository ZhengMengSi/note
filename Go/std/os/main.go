package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	// file, err := os.Open("1.go")
	file, err := os.Open("D:\\zms\\IT\\Projects\\github.com\\note\\Go\\std\\os\\1.go")
	if err != nil {
		log.Fatal(err)
	}

	data := make([]byte, 100)
	count, err := file.Read(data)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("read %d bytes: %q\n", count, data[:count])
}
