package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Static("/static", "../web")
	router.GET("/", func(c *gin.Context) {
		c.File("../web/index.html")
	})
	router.GET("/style.css", func(c *gin.Context) {
		c.File("../web/style.css")
	})
	router.GET("/script.js", func(c *gin.Context) {
		c.File("../web/script.js")
	})
	router.NoRoute(func(c *gin.Context) {
		c.File("../web/404.html")
		c.Status(http.StatusNotFound)
	})
	router.Run(":8080")
}
