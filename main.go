package main

import (
	"embed"
	"io/fs"
	"log"
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

// Embed a file directory into the binary
//
//go:embed static
var frontend embed.FS

func getFileSystem() fs.FS {
	fsys, err := fs.Sub(frontend, "static")
	if err != nil {
		log.Fatalln(err)
	}

	return fsys
}

func main() {
	// HTTP Server / Config
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	// Web server to serve React files on "/"
	e.StaticFS("/", getFileSystem())

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
