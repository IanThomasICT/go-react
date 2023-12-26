package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

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
//go:embed app/dist
var reactDist embed.FS

// pick if we want to use OS FS or Embedded FS
func getFileSystem(useOS bool) http.FileSystem {
	if useOS {
		return http.FS(os.DirFS("static"))
	}

	log.Print("using embed mode")
	fsys, err := fs.Sub(reactDist, "app/dist")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}

func main() {
	useOS := len(os.Args) > 1 && os.Args[1] == "live"
	assetHandler := http.FileServer(getFileSystem(useOS))

	// HTTP Server / Config
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	// Web server to serve React files on "/"
	e.GET("/*", echo.WrapHandler(assetHandler))

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
