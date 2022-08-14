package main

import (
	"bytes"
	"io"
	"os"
)

func main() {
	var w io.Writer
	w = os.Stdout
	_ = w.(*os.File)
	_ = w.(*bytes.Buffer)
}
