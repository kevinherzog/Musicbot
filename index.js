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


client.on('message', message => {
    /* Checks if the message is addressed at the bot or if it is send by a bot */
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    /* Splits message into parts, then changes the first toLowerCase and sets it as commandName */
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    /* Searches if the text matches an alias, if so it sets it to command */
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
    /* Return if there is no such command */
	if (!command) return;


    /* Look if command has all needed components (May be removed in the future, if juged to be not needed) */
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
    }

    /* Try to execute the command */
	try {
		command.execute(message, args);
	} 
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);