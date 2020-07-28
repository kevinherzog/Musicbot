const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const { prefix, token } = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

/* List of Commands for User */
console.log(client.commands);

/* Connection Status for console */
client.once('ready', () => {
    consol.log('Ready!');
})
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});