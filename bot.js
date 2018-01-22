//NPM

var fs = require('fs');
var request = require('request');
var keys = require("./keys.js")
var spotify = require('node-spotify-api');


//users input via commandline.
var nodeArgv = process.argv;
var command = process.argv[2];

// media user input (movie or song)
var media = "";

//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    media = media + "+" + nodeArgv[i];
  } else{
    media = media + nodeArgv[i];
  }
}

//Switch for spotify or omdb
switch(command){

  case "spotify-this-song":
    if(media){
      spotifyThisSong(media);
    } else{
      spotifyThisSong("Fluorescent Adolescent");
    }
  break;

  case "movie-this":
    if(media){
      omdbData(media)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: spotify-this-song, movie-this, do-what-it-says}");
  break;
}

//begin spotify functionality - please note - currently receiving unknown errors on my work station


function spotifyThisSong(){

  var spotify = new Spotify ({
    id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
  });
  //method used for searching in spotify via CLI
    
    spotify.search({ type: 'track', query: song}, function(error, data){
    
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        
        var songData = data.tracks.items[i];

        //artist
        console.log("Artist: " + songData.artists[0].name);

        //song name
        console.log("Song: " + songData.name);

        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);

        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        

      }
    } else{
      console.log('Error occurred.');
    }
  });
} // end spotify

//begin oomdb functionality 
function omdbData(){
  var omdbURL = 'http://www.omdbapi.com/?apikey=40e9cece&?t=' + movie + '&plot=short&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);


    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
    }
  });

} // end oomdb

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}
