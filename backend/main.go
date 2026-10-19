package main

import (
	bufio
	fmt
	log
	net/http
	os
	path/filepath
	strings
	time

	github.com/gin-gonic/gin
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func parse(configFile string, router *gin.Engine) error {
	path := filepath.Join(.., configFile)

	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var route string

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		if line ==  {
			continue
		}

		if route ==  {
			route = line
			continue
		}

		routePath := route
		filePath := line

		router.GET(routePath, func(c *gin.Context) {
			c.File(filePath)
		})

		route = 
	}

	if err := scanner.Err(); err != nil {
		return err
	}

	if route !=  {
		return fmt.Errorf(missing file path for route %q, route)
	}

	return nil
}

func printStartMessage() {
	now := time.Now()
	fmt.Printf(Sunucu: %v de basladi, now.Local())
}

func main() {
	printStartMessage()

	router := gin.Default()
	router.Static(/static, ../web)

	if err := parse(routes.txt, router); err != nil {
		log.Fatal(err)
	}

	router.NoRoute(func(c *gin.Context) {
		c.Status(http.StatusNotFound)
		c.File(../web/404.html)
	})

	if err := router.Run(:8080); err != nil {
		log.Fatal(err)
	}
}

