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

function spotifySearch() {
    spotify
        .search({ type: 'track', query: userInput, limit: 1 })
        .then(function (response) {
            console.log(JSON.stringify(response, null, 2));
            console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
            console.log("Song name: " + response.tracks.items[0].name);
            console.log("Album name: " + response.tracks.items[0].album.name);
            console.log("Preview link: " + response.tracks.items[0].preview_url);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function concertSearch() {
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Venue name: " + response.data[0].venue.name);
            console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Event date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        })
        .catch(function () {
            console.log("That band isn't touring right now.");
        });
}

function movieSearch() {

}

function doWhatItSays() {

}

/*
==================================
Switch
==================================
*/

switch (command) {
    case "spotify-this-song":
        spotifySearch();
        break;
    case "concert-this":
        concertSearch();
        break;
    case "movie-this":
        movieSearch();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        return false;
}