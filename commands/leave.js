module.exports = {
	name: 'leave',
	description: 'Forces bot to leave and clear queue.',
	execute(bot, message, args){
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send(
            "You need to be in a voice channel to play music!"
          );
        voiceChannel.leave();
        
        bot.destroy();
    }
};