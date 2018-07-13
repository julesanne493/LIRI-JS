require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var searchQuery = process.argv[2];
var queryArr = process.argv.slice(3);
var query = queryArr.join(" ");

function Spotify (name){
    id = name.id;
    secret = name.secret;
};

function Twitter (name) {
    consumer_key = name.consumer_key;
    consumer_secret = name.consumer_secret;
    access_token_key = name.access_token_key;
    access_token_secret = name.access_token_secret;
}

var client = new Twitter(keys.twitter);

var spotify = new Spotify(keys.spotify);

function searchSong ()
 {spotify.search({ type: 'track', query: query}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } 
  console.log("Artist name: " + data.tracks.items[0].artists[0].name);
  console.log("Album name: " + data.tracks.items[0].album.name);
  console.log("Song name: " + data.tracks.items[0].name);
  console.log("Link: " + data.tracks.items[0].album.href);
  });}

if (searchQuery === "spotify-this-song" && query){
    searchSong();
}
else if (searchQuery ==="spotify-this-song" && !query) {
    query = "All Too Well";
    searchSong();
}

function getTweets (){
    var params = {q:"@smallestlime", count: 20};
    client.get("statuses/user_timeline", params, function(error, tweets,response){
        for (var i=0; i<tweets.length; i++){
        console.log("Tweet: " + tweets[i].text);
        console.log("Created: " + tweets[i].created_at);
        }
    })
}

function requestMovie (){
    request("http://www.omdbapi.com/?t=" + query +"&y=&plot=short&apikey=trilogy", function(error, response, body) {

  if (!error && response.statusCode === 200) {
    
    var movieData = JSON.parse(body)

    console.log("Title: " + movieData.Title);
    console.log("This movie came out in: " + movieData.Year);
    console.log("This movie is rated " + movieData.Rated);
    console.log("This movie was rated " + movieData.Ratings[1].Value + " on Rotten Tomatoes.");
    console.log("This movie was produced in " + movieData.Country);
    console.log("This movie is in " + movieData.Language);
    console.log("Plot: " + movieData.Plot);
    console.log("The actors in this movie are: " + movieData.Actors);
  }

});

}

if (searchQuery === "movie-this" && query) {
    requestMovie();
}
else if (searchQuery === "movie-this" && !query) {
    query = "Mr. Nobody";
    requestMovie();
}

function doWhat (){
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
          } 
        newData = data.split(",");
        searchQuery = newData[0];
        query = newData[1];
        searchSong();
});
}

if (searchQuery === "do-what-it-says"){
    doWhat();
}

       
if (searchQuery === "my-tweets"){
    getTweets();
}