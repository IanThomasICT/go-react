package main

import (
	"net/http"

	"github.com/carlmjohnson/requests"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type CatFact struct {
	Fact   string `json:"fact"`
	Length int64  `json:"length"`
}

type ResponseObj struct {
	Ok   bool        `json:"ok"`
	Data interface{} `json:"data"`
}

func main() {

	// HTTP Server / Config
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	// Web server to serve React files on "/"
	e.Static("/", "static")

	// API Routes
	api := e.Group("/api")

	api.GET("/greeting", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello world")
	})

	api.GET("/cat-facts/random", func(c echo.Context) error {
		var data CatFact

		if err := requests.
			URL("https://catfact.ninja/fact").
			ToJSON(&data).
			Fetch(c.Request().Context()); err != nil {
			return c.JSON(http.StatusInternalServerError, new(ResponseObj))
		}

		return c.JSON(200, &ResponseObj{true, data})
	})

	e.Logger.Fatal(e.Start(":8080"))
}
