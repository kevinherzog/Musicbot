const ytdl = require("ytdl-core");
const yts = require('yt-search');
module.exports = {
  name: 'play',
  aliases: ['start'],
  usage: '<Title/URL>',
  description: 'Play a song or queue one.',
  async execute(message, args) {
    try {
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;

      var combined = args.join(' ');
          console.log('Is this undefined?');
          this.whatSong(combined);
          console.log('Is this undefined?');

      const songInfo = ytdl.getInfo(this.whatSong(combined));
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

  },

  whatSong(combined) {
    var addSong = '';
      yts(combined, function (err, r) {
        if (err) throw err;
        console.log('still defined');
        let videos = r.videos;
        console.log(videos[0]);
        addSong = videos[1].url;
        console.log(addSong);
      })
      return addSong;
  }
  
};