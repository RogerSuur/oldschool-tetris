package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"

	"github.com/rs/cors"
)

type tetrisPlayer struct {
	Rank  string `json:"Rank"`
	Name  string `json:"Name"`
	Score int    `json:"Score"`
	Time  string `json:"Time"`
}

type postSend struct {
	SortedData []tetrisPlayer `json:"sortedData_array,omitmepty"`
	Ranking    int            `json:"ranking,omitmepty"`
	Percent    int            `json:"percent,omitmepty"`
}

var ranking int = 0

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Default port to listen on if PORT environment variable is not set
	}

	// Enable CORS

	fileServer := http.FileServer(http.Dir("./static"))
	corsHandler := cors.Default().Handler(fileServer)

	corsScoreBoard := cors.Default().Handler(http.HandlerFunc(scoreBoard))

	http.Handle("/scoreBoard", corsScoreBoard)
	http.Handle("/", corsHandler)

	log.Printf("Server listening on port %s", port)
	http.ListenAndServe(":"+port, nil)
}

func scoreBoard(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case http.MethodGet:
		// We Read the response body on the line below.
		body, err := ioutil.ReadFile("scores.json")
		if err != nil {
			log.Fatalln(err)
		}
		// Convert the body to type string
		sb := string(body)
		fmt.Fprintf(w, (sb))

	case http.MethodPost:

		player := new(tetrisPlayer)
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&player)
		if err != nil {
			fmt.Println(err)
		}

		file, err := ioutil.ReadFile("scores.json")
		if err != nil {
			panic(err)
		}
		player.Time = seconds(player.Time)

		data := []tetrisPlayer{}
		if err := json.Unmarshal(file, &data); err != nil {
			panic(err)
		}

		data = append(data, *player)

		sortedData, ranking, percent := sort(data, player)

		// Preparing the data to be marshalled and written.
		dataBytes, err := json.MarshalIndent(sortedData, "", "\t")
		if err != nil {
			panic(err)
		}

		err = ioutil.WriteFile("scores.json", dataBytes, 0644)
		if err != nil {
			panic(err)
		}
		d := postSend{SortedData: sortedData[0:5], Ranking: ranking, Percent: percent}

		bytes, err := json.Marshal(d)
		if err != nil {
			fmt.Println("error marshalling")
		}
		// w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
		w.Write(bytes)
	}
}

func sort(unsorted []tetrisPlayer, player *tetrisPlayer) (sorted []tetrisPlayer, ranking int, percent int) {
	numberOfPlayer := len(unsorted)
	isDone := false
	ranking = numberOfPlayer
	for !isDone {
		isDone = true
		i := 0
		for i < numberOfPlayer-1 {
			if unsorted[i].Score < unsorted[i+1].Score {
				ranking -= 1
				unsorted[i], unsorted[i+1] = unsorted[i+1], unsorted[i]
				isDone = false
			}
			i++
		}
	}

	for i := 0; i < len(unsorted); i++ {
		unsorted[i].Rank = strconv.Itoa(i + 1)
	}

	result := math.Round(float64(ranking) / float64(numberOfPlayer) * 100)
	return unsorted, ranking, int(result)
}

func seconds(inSeconds string) string {
	secondsInt, _ := strconv.Atoi(inSeconds)
	minutes := secondsInt / 60
	seconds := secondsInt % 60
	str := strconv.Itoa(minutes) + "m" + strconv.Itoa(seconds) + "s"
	return str
}
