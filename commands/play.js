const ytdl = require("ytdl")

module.exports = {
	name: 'play',
	aliases: ['start'],
	usage: '<Title/URL>',
	description: 'Play a song or queue one.',
	execute(message, args){
        let input = args.join(' ');
    }
};