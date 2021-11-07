const InteractionCommandBuilder = require('../scripts/interactionCommandBuilder');
const MessageCommandBuilder = require('../scripts/messageCommandBuilder');
const SafeMessage = require('../scripts/safeMessage');
const SafeInteract = require('../scripts/safeInteract');
const CommandPermission = require('../scripts/commandPermissions');
const interactionPaginationEmbed = require('discordjs-button-pagination');
const { Pagination } = require("discordjs-button-embed-pagination");
const { MessageEmbed, MessageButton } = require("discord.js");
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

const commands = { MessageCommands: {}, InteractionCommands: {}};

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

    for(let name of command.arguments){
        let values = "";
        let arg = name.required ? argTypes['required'] : argTypes['optional'];
            arg = Util.replaceAll(arg, '%arg%', name.name);

        if(name?.values && name.values.length > 0){
            let endLength = name.values.length;
            let increment = 0;
            values += ': ';

            for (const value of name.values) {
                increment++;
                values += value;
                if(increment < endLength) values += ", ";
            }
        }

        args += ' ' + Util.replaceAll(arg, '%values%', values);
    }

    commandDisplay = commandDisplay + args;
    commands.MessageCommands[command.name] = { display: commandDisplay, arguments: args.trim(), description: command?.description };
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
    commands.InteractionCommands[command.name] = { display: commandDisplay, arguments: args.trim(), description: command.command?.description };
}
function filterVisibleCommands(allCommands, filter, member, commandsPerms) {
    const newCommands = allCommands.filter((elmt) => {
        // Check permissions
        if(!CommandPermission(elmt, member, commandsPerms)) return false;

        // Filter
        if(filter && filter.length > 0) { return elmt.toLowerCase().indexOf(filter.toLowerCase()) !== -1; }
        return true;
    });

    return Object.keys(newCommands).length ? newCommands : false;
}
function ifNewPage(i, intLimit) {
    return i >= (intLimit - 1);
}
function makePages(visibleCommands, allCommands, client, language, prefix, embedColor) {
    // Create embeds
    let embeds = [];
    let limit = 5;
    let increment = -1;
    let current = 0;
    
    // Separate embeds
    if(!visibleCommands) return [new MessageEmbed().setTitle(Util.getRandomKey(language.noResponse))];
    for (const value of visibleCommands) {
        // Increment page
        if(ifNewPage(increment, limit)) { current++; increment = 0; } else { increment++; }

        // Create embed
        if(!embeds[current]) {
            embeds.push(new MessageEmbed()
                .setAuthor(Util.getRandomKey(language.help.title), client.user.displayAvatarURL())
                .setDescription(Util.getRandomKey(language.help.description))
                .setColor(embedColor)
                .setTimestamp());
        }

        // Add command
        embeds[current].addField(value, '*'+ allCommands[value].description +'*\n```'+ prefix + allCommands[value].display +'```', false);
    }

    return embeds;
}
async function getHelpMessage(args, message, Client) {
    let filter = args.join(' ');
    let visibleCommands = Object.keys(commands.MessageCommands);
        visibleCommands = filterVisibleCommands(visibleCommands, filter, message.member, Client.AxisUtility.getConfig().permissions.messageCommands);
    
    // Create embeds
    let embeds = makePages(visibleCommands, commands.MessageCommands, Client, Client.AxisUtility.getLanguage(), '/', Client.AxisUtility.getConfig().embedColor);
    
    if(embeds.length == 1) {
        await SafeMessage.reply(message, { embeds: embeds });
    } else {
        await new Pagination(message.channel, embeds, "Page", interactionTimeout).paginate().catch(err => log.error(err));
    }
}
async function getHelpInteraction(interaction, Client) {
    let filter = !interaction.options.getString('filter') ? '' : interaction.options.getString('filter');
    let visibleCommands = Object.keys(commands.InteractionCommands);
        visibleCommands = filterVisibleCommands(visibleCommands, filter, interaction.member, Client.AxisUtility.getConfig().permissions.interactionCommands);
    
    // Create embeds
    let embeds = makePages(visibleCommands, commands.InteractionCommands, Client, Client.AxisUtility.getLanguage(), '/', Client.AxisUtility.getConfig().embedColor);
    
    // Create buttons
    const buttons = [
        new MessageButton()
            .setCustomId("previousbtn")
            .setLabel("Previous")
            .setStyle("DANGER"),
        new MessageButton()
            .setCustomId("nextbtn")
            .setLabel("Next")
            .setStyle("SUCCESS")
    ];

    // Send response
    await SafeInteract.deferReply(interaction);
    if(embeds.length == 1) { 
        await SafeInteract.editReply(interaction, { embeds: embeds });
    } else {
        await interactionPaginationEmbed(interaction, embeds, buttons, interactionTimeout).catch( err => log.error(err));
    }
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
                .addArgument('filter', false, 'Filter commands')
                .setExecute(async (args, message, Client) => getHelpMessage(args, message, Client)),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('help')
                    .setDescription('Get command help')
                    .addStringOption(filter => filter
                        .setName('filter')
                        .setRequired(false)
                        .setDescription('Filter commands')
                    )
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
        fetchCommands(Client.AxisUtility.getCommands().MessageCommands);
        fetchCommands(Client.AxisUtility.getCommands().InteractionCommands);
    }
}

module.exports = new Create();