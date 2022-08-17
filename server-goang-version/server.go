package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)
 
func main() {
	// db, err := sql.Open("sqlite3", "./database/nft.db")

	r := gin.Default()

	r.POST("/login", func(c *gin.Context) {
		c.String(http.StatusOK, "login")
	})

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "hello")
	})

	r.GET("/assets", func(c *gin.Context) {
		c.String(http.StatusOK, "get all assets!")
	})
	
	r.GET("/assets/:id", func(c *gin.Context) {
		
		c.String(http.StatusOK, "GET assets!")

	})
	
	r.POST("/assets", func(c *gin.Context) {
		c.String(http.StatusOK, "POST assets!")
	})

	// r.PUT("/assets/:id", func(c *gin.Context) {
		
	// 	c.String(http.StatusOK, "assets!")

	// })

	// r.DELETE("/assets/:id", func(c *gin.Context) {
		
	// 	c.String(http.StatusOK, "assets!")

	// })


	r.Run(":8000")
}