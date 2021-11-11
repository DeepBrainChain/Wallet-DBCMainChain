package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"time"

	"github.com/vartanbeno/go-reddit/v2/reddit"

	"net/http"
	"regexp"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const DBCSubreddit = "DBC_Council"

var (
	goVersion  string
	gitCommit  string
	commitTime string

	postIDToURL      = make(map[string]string)
	defaultReturn    = "https://www.reddit.com/r/DBC_Council/"
	errRetryInterval = 5 * time.Second
	updateInterval   = 30 * time.Second
)

func main() {
	port := flag.String("port", "1323", "port")
	printVersion := flag.Bool("version", false, "print version")
	flag.Parse()
	if *printVersion {
		fmt.Printf("git commit: %s %s \n", gitCommit, commitTime)
		fmt.Printf("go version: %s \n", goVersion)
		return
	}

	go func() {
		for {
			updatePostMap()
			time.Sleep(updateInterval)
		}
	}()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.DefaultCORSConfig))

	e.GET("/getpost/:id", postHandler)

	e.Logger.Fatal(e.Start(":" + *port))
}

func postHandler(c echo.Context) error {
	id := c.Param("id")

	url, ok := postIDToURL[id]
	if ok {
		return c.String(http.StatusOK, url)
	} else {
		return c.String(http.StatusNotFound, defaultReturn)
	}
}

func updatePostMap() {
	for {
		client, err := reddit.NewReadonlyClient()
		if err != nil {
			time.Sleep(errRetryInterval)
			continue
		}

		posts, _, err := client.Subreddit.NewPosts(context.Background(), DBCSubreddit, &reddit.ListOptions{
			Limit: 100,
		})
		if err != nil {
			time.Sleep(errRetryInterval)
			continue
		}

		for i := 0; i < len(posts); i++ {
			postID, err := getId(posts[i].Title)
			if err != nil {
				continue
			}
			postIDToURL[postID] = posts[i].URL
		}
		return
	}
}

func getId(str string) (string, error) {
	regexp, _ := regexp.Compile(`#([0-9]+)`)
	match := regexp.FindStringSubmatch(str)

	if len(match) == 2 {
		return match[1], nil
	}
	return "", errors.New("Not found")
}
