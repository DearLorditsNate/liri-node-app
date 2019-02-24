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

// Inquirer
var inquirer = require("inquirer");

/*
==================================
Global Variables
==================================
*/

// Stores current search log
var log = [];

/*
==================================
Function Declarations
==================================
*/

function initialize() {
    inquirer.prompt([
        {
            type: "list",
            message: "\nHello, I'm LIRI! What can I help you with today?",
            choices: ["spotify-this-song", "concert-this", "movie-this", "do-what-it-says", "never-mind"],
            name: "command"
        }
    ]).then(answer => {
        actions(answer.command);
    });
}

function followUp() {
    inquirer.prompt([
        {
            type: "list",
            message: "\nIs there anything else I can do for you?",
            choices: ["spotify-this-song", "concert-this", "movie-this", "do-what-it-says", "never-mind"],
            name: "command"
        }
    ]).then(answer => {
        actions(answer.command);
    });
}

function getSpotifyInput(userInput) {
    var input;
    // Checks for input from do-what-it-says
    if (userInput) {
        input = userInput;
        spotifySearch(input);
    } else {
        inquirer.prompt([
            {
                type: "input",
                message: "\nOk, I can help with that! What song would you like to search for?",
                name: "userInput"
            }
        ]).then(answer => {
            // Default for no input
            if (!answer.userInput) {
                answer.userInput = "The Sign, Ace of Base";
            }
            spotifySearch(answer.userInput);
        });
    }
}

function spotifySearch(input) {
    spotify
        .search({ type: 'track', query: input, limit: 1 })
        .then(response =>  {
            console.log("\n========================")
            console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
            console.log("Song name: " + response.tracks.items[0].name);
            console.log("Album name: " + response.tracks.items[0].album.name);
            console.log("Preview link: " + response.tracks.items[0].preview_url);
            console.log("========================\n")

            log.push("Artist: " + response.tracks.items[0].album.artists[0].name + "\n", "Song name: " + response.tracks.items[0].name + "\n", "Album name: " + response.tracks.items[0].album.name + "\n", "Preview link: " + response.tracks.items[0].preview_url + "\n\n");
            
            writeLog();

            followUp();
        })
        .catch(function () {
            console.log("\nSorry, I couldn't find that song. Please try asking again!");
            actions("spotify-this-song");
        });
}

function getConcertInput(userInput) {
    var input;
    // Checks for input from do-what-it-says
    if (userInput) {
        input = userInput;
        concertSearch(input);
    } else {
        inquirer.prompt([
            {
                type: "input",
                message: "\nSure thing! What band do you want to see live?",
                name: "userInput"
            }
        ]).then(answer => {
            concertSearch(answer.userInput);
        });
    }
}

function concertSearch(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("\n========================")
            console.log("Venue name: " + response.data[0].venue.name);
            console.log("Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Event date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
            console.log("========================\n")

            log.push("Venue name: " + response.data[0].venue.name + "\n", "Venue location: " + response.data[0].venue.city + ", " + response.data[0].venue.country + "\n", "Event date: " + moment(response.data[0].datetime).format("MM/DD/YYYY") + "\n\n");

            writeLog();

            followUp();
        })
        .catch(function () {
            console.log("\nThat band isn't touring right now. Try moshing to another band!");
            actions("concert-this");
        });
}

function getMovieInput(userInput) {
    var input;
    // Checks for input from do-what-it-says
    if (userInput) {
        input = userInput;
        movieSearch(input);
    } else {
        inquirer.prompt([
            {
                type: "input",
                message: "\nI'll pop some popcorn! What movie do you want some facts about?",
                name: "userInput"
            }
        ]).then(answer => {
            // Default for no input
            if (!answer.userInput) {
                answer.userInput = "Mr. Nobody";
            }
            movieSearch(answer.userInput);
        });
    }
}

function movieSearch(input) {
    axios.get("http://www.omdbapi.com/?apikey=7a69e743&t=" + input)
        .then(function (response) {
            console.log("\n========================")
            console.log("Title: " + response.data.Title);
            console.log("Release year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Production Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
            console.log("========================\n")

            log.push("Title: " + response.data.Title + "\n", "Release year: " + response.data.Year + "\n", "IMDB Rating: " + response.data.Ratings[0].Value + "\n", "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n", "Production Country: " + response.data.Country + "\n", "Language: " + response.data.Language + "\n", "Actors: " + response.data.Actors + "\n", "Plot: " + response.data.Plot + "\n\n");

            writeLog();

            followUp();
        }).catch(function () {
            console.log("\nThis isn't the movie you're looking for... Try searching for something else!");
            actions("movie-this");
        });
}

function doWhatItSays() {
    console.log("\nI am just a bot, after all! Here you go.");

    // Reads random.txt | will work with any command/input available
    fs.readFile("./random.txt", (err, data) => {
        if (err) {
            console.log(err);
        }
        var params = data.toString().replace(/['"]+/g, '').split(",");

        actions(params[0], params[1]);
    });
}

function writeLog() {
    // Removes commas
    var toWrite = log.toString().replace(/[,]+/g, '');

    fs.appendFile("./log.txt", toWrite, "UTF8", err => {
        console.log(err);
    });

    // Reset log array to prevent dupes
    log = [];
}

/*
==================================
Switch
==================================
*/

function actions(command, userInput) {
    switch (command) {
        case "spotify-this-song":
            getSpotifyInput(userInput);
            break;
        case "concert-this":
            getConcertInput(userInput);
            break;
        case "movie-this":
            getMovieInput(userInput);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        case "never-mind":
            console.log("\nOk, I'm here when you need me!\n");
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

initialize();