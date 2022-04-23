import fs from 'fs';
import {REST} from '@discordjs/rest';
import {SlashCommandBuilder} from '@discordjs/builders';
import {Routes} from 'discord-api-types/v9';
import {Client, Intents, Collection, ClientOptions} from 'discord.js';
import {settings} from './botSettings'
const clientOptions = {intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
],
ws: {
    properties: {
        $browser: "Discord iOS"
    }
}}
class MyClient extends Client {
    public commands: Collection<string, object>;
    constructor(options: ClientOptions) {
      super(options);
    };
};
const client = new MyClient(clientOptions)
const globalCommands:any = [];
const testOnlyCommands:any = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    if(!command.testOnly || command.testOnly === false){
        const newSlashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        globalCommands.push(newSlashCommand);
    } else if(command.testOnly && command.testOnly === true){
        testOnlyCommands.push(command);
    }
}
client.once('ready',() => {
    console.log('Registering commands!')
    if(client?.user?.id && process?.env?.token){
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(process.env.token);
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                    body: globalCommands
                },
            );
            console.log('Registered Global Commands');
        } catch (error) {
            if (error) console.log(error);
        }
    })();
    (async()=>{
        try{
            settings.testGuilds.forEach(async function(guild) {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, guild), {
                        body: testOnlyCommands
                    },
                );
            })
            console.log('Registered TestOnly Commands')
        } catch (error) {
            if (error) console.log(error);
        }
    })();
} else {
    console.error('UserID could not be fetched! Did you use the right token?')
}
})
client.login(process.env.token)
export {client}