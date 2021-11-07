const InteractionCommandBuilder = require('../scripts/interactionCommandBuilder');
const MessageCommandBuilder = require('../scripts/messageCommandBuilder');
const SafeMessage = require('../scripts/safeMessage');
const SafeInteract = require('../scripts/safeInteract');
const Util = require('fallout-utility');
const Version = require('../scripts/version');

const log = new Util.Logger('Axis');
const interactionTimeout = 20000;
const argTypes = {
    required: "<%arg%%values%>",
    optional: "[%arg%%values%]"
}

async function getVersionMessage(args, message, Client) {
    await SafeMessage.reply(message, `**${Client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
}
async function getVersionInteraction(interaction, Client) {
    await SafeInteract.reply(interaction, `**${Client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
}
function StopMessage(Client) {
    log.warn("Stopping...");
    return Util.getRandomKey(Client.AxisUtility.getLanguage().stop);
}

const commands = { MessageCommands: [], InteractionCommands: []};

function fetchCommands(object) {
    for (const command of object) {
        if(command.type === 'MessageCommand') {
            fetchMessageCommand(command);
        } else if(command.type === 'InteractionCommand') {
            fetchInteractionCommand(command);
        }
    }
}
function fetchMessageCommand(command) {
    let commandDisplay = command.name;
    let args = '';

    for(let name in command.arguments){
        let values = "";
        let arg = command.arguments[name].required ? argTypes['required'] : argTypes['optional'];
            arg = Util.replaceAll(arg, '%arg%', name);

        if(command.arguments[name]?.values && command.arguments[name].values.length > 0){
            let endLength = command.arguments[name].values.length;
            let increment = 0;
            values += ': ';

            for (const value of command.arguments[name].values) {
                increment++;

                values += value;
                if(increment < endLength) values += ", ";
            }
        }

        args += ' ' + Util.replaceAll(arg, '%values%', values);
    }

    commandDisplay = commandDisplay + args;
    commands.MessageCommands[command.name] = { display: commandDisplay, arguments: args, description: command?.description };
}
function fetchInteractionCommand(command) {
    let commandDisplay = command.name;
    let args = '';

    for(let name of command.command.options){
        let arg = name.required ? argTypes['required'] : argTypes['optional'];
            arg = Util.replaceAll(arg, '%arg%', name.name);
            arg = Util.replaceAll(arg, '%values%', '');

        args += ' ' + arg;
    }

    commandDisplay = commandDisplay + args;
    commands.MessageCommands[command.name] = { display: commandDisplay, arguments: args, description: command?.description };
}
async function getHelpMessage(args, message, Client) {
    console.log(commands);
}
async function getHelpInteraction(interaction, Client) {
    console.log(commands);
}

class Create {
    constructor() {
        this.versions = ['1.4.0'];
        this.commands = [
            // Version command
            new MessageCommandBuilder()
                .setName('version')
                .setDescription('Displays the current version of your Axis bot.')
                .setExecute((args, message, Client) => getVersionMessage(args, message, Client)),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('version')
                    .setDescription('Displays the current version of your Axis bot.')
                )
                .setExecute((interaction, Client) => getVersionInteraction(interaction, Client)),

            // Stop command
            new MessageCommandBuilder()
                .setName('stop')
                .setDescription('Stop the bot')
                .setExecute(async (args, message, Client) => { await SafeMessage.reply(message, StopMessage(Client)); process.exit(0); }),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('stop')
                    .setDescription('Stop the bot')
                )
                .setExecute(async (interaction, Client) => { await SafeInteract.reply(interaction, StopMessage(Client)); process.exit(0); }),
            
            // Help command
            new MessageCommandBuilder()
                .setName('help')
                .setDescription('Get command help')
                .setExecute(async (args, message, Client) => getHelpMessage(args, message, Client)),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('help')
                    .setDescription('Get command help')
                )
                .setExecute(async (interaction, Client) => getHelpInteraction(interaction, Client))
        ]
    }
    start = async (Client) => {
        log.log('Axis default command module has started!');
        log.log('Configuring bot presence...');

        const config = Client.AxisUtility.getConfig();
        await Client.user.setPresence({
            status: Util.getRandomKey(config.presence.status),
            activities: [{
                name: Util.getRandomKey(config.presence.activityName),
                type: Util.getRandomKey(config.presence.type).toUpperCase()
            }]
        });

        return true;
    }
    
    loaded(Client) {
        fetchCommands(Client.AxisUtility.getCommands());
    }
}

module.exports = new Create();