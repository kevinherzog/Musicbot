const ytdl = require("ytdl-core")

module.exports = {
	name: 'play',
	aliases: ['start'],
	usage: '<Title/URL>',
	description: 'Play a song or queue one.',
	async execute(message, args){
        try {
            const queue = message.client.queue;
            const serverQueue = message.client.queue.get(message.guild.id);
      
            const voiceChannel = message.member.voice.channel;
            
            var addSong;

            if(args.includes('youtube')){
                addSong = args[0];
            }else{
                let combined = args.join(' ');
                console.log(combined);
            }
            const songInfo = await ytdl.getInfo(addSong);
            const song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url
            };
      
            if (!serverQueue) {
              const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
              };
      
              queue.set(message.guild.id, queueContruct);
      
              queueContruct.songs.push(song);
      
              try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message, queueContruct.songs[0]);
              } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
              }
            } else {
              serverQueue.songs.push(song);
              return message.channel.send(
                `${song.title} has been added to the queue!`
              );
            }
          } catch (error) {
            console.log(error);
            message.channel.send(error.message);
          }
        },
      
        play(message, song) {
          const queue = message.client.queue;
          const guild = message.guild;
          const serverQueue = queue.get(message.guild.id);
      
          if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
          }
      
          const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
              serverQueue.songs.shift();
              this.play(message, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
          dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
          serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    
    }
};