/*
==================================
Initialize Packages
==================================
*/

// Spotify
var Spotify = require('node-spotify-api');

// .env
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Axios
var axios = require("axios");

// Moment
var moment = require("moment");

// FS
var fs = require("fs");

/*
==================================
Global Variables
==================================
*/

var command = process.argv[2];
var userInput = process.argv[3];

/*
==================================
Function Declarations
==================================
*/

function spotifySearch(input) {
    spotify
        .search({ type: 'track', query: input, limit: 1 })
        .then(function (response) {
            console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
            console.log("Song name: " + response.tracks.items[0].name);
            console.log("Album name: " + response.tracks.items[0].album.name);
            console.log("Preview link: " + response.tracks.items[0].preview_url);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function concertSearch(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Venue name: " + response.data[0].venue.name);
            console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Event date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        })
        .catch(function () {
            console.log("That band isn't touring right now.");
        });
}

function movieSearch(input) {
    axios.get("http://www.omdbapi.com/?apikey=7a69e743&t=" + input)
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Production Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
        })
        .catch(function () {
            console.log("That band isn't touring right now.");
        });
}

function doWhatItSays() {
    fs.readFile("./random.txt", (err, data) => {
        if (err) {
            console.log(err);
        }
        var params = data.toString().split(",");

        actions(params[0], params[1]);
    });
}

/*
==================================
Switch
==================================
*/

function actions(command, userInput) {
    switch (command) {
        case "spotify-this-song":
            spotifySearch(userInput);
            break;
        case "concert-this":
            concertSearch(userInput);
            break;
        case "movie-this":
            movieSearch(userInput);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            return false;
    }
}

/*
==================================
Function Calls
==================================
*/

// Initialize Switch
actions(command, userInput);