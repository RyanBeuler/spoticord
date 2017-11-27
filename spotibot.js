var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var lame = require('lame');
var Speaker = require('speaker');
var Spotify = require('spotify-web');
var uri = process.argv[2] || 'spotify:track:1N8xmBWy10c2w1U8ZgPxtG';

// Spotify credentials...
var username = process.env.USERNAME;
var password = process.env.PASSWORD;

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
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            case 'play':
                Spotify.login(username, password, function (err, spotify) {
                  if (err) throw err;
                  // first get a "Track" instance from the track URI
                  spotify.get(uri, function (err, track) {
                    if (err) throw err;
                    console.log('Playing: %s - %s', track.artist[0].name, track.name);
                    // play() returns a readable stream of MP3 audio data
                    track.play()
                      .pipe(new lame.Decoder())
                      .pipe(new Speaker())
                      .on('finish', function () {
                        spotify.disconnect();
                      });

                  });
                });
                bot.sendMessage({
                    to: channelID,
                    message: 'Playing Spotify track!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});
