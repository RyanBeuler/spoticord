var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var SpotifyWebApi = require('spotify-web-api-node');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '27f2f3f1bcc043da81c46c9400468641',
  clientSecret : 'eb976f780c7e4dc88b221717a5a09ee3',
  redirectUri : 'http://www.example.com/callback'
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !play
            case 'play':
                bot.sendMessage({
                    to: channelID,
                    message: 'Playing Spotify track!'
                });
                // First retrieve an access token
                spotifyApi.authorizationCodeGrant(authorizationCode)
                  .then(function(data) {
                    console.log('Retrieved access token', data.body['access_token']);
                    // Set the access token
                    spotifyApi.setAccessToken(data.body['access_token']);
                    // Use the access token to retrieve information about the user connected to it
                    return spotifyApi.getMe();
                  })
                  .then(function(data) {
                    // "Retrieved data for Faruk Sahin"
                    console.log('Retrieved data for ' + data.body['display_name']);
                    // "Email is farukemresahin@gmail.com"
                    console.log('Email is ' + data.body.email);
                    // "Image URL is http://media.giphy.com/media/Aab07O5PYOmQ/giphy.gif"
                    console.log('Image URL is ' + data.body.images[0].url);
                    // "This user has a premium account"
                    console.log('This user has a ' + data.body.product + ' account');
                  })
                  .catch(function(err) {
                    console.log('Something went wrong', err.message);
                  });
            break;
            // Just add any case commands if you want to..
         }
     }
});
