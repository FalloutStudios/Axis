const { InteractionCommandBuilder, MessageCommandBuilder } = require('../scripts/builders');
const { SafeMessage, SafeInteract } = require('../scripts/safeActions');
const CommandPermission = require('../scripts/commandPermissions');
const InteractionPaginationEmbed = require('discordjs-button-pagination');
const { Pagination } = require("discordjs-button-embed-pagination");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const Util = require('fallout-utility');
const Version = require('../scripts/version');
const MakeConfig = require('../scripts/makeConfig');
const Yml = require('yaml');

// Configs
let log = new Util.Logger('Axis');
const interactionTimeout = 20000;
const argTypes = {
    required: "<%arg%%values%>",
    optional: "[%arg%%values%]"
}
let options = null;
let versionMessageReply = "";

// Main class
class AxisCommands {
    constructor() {
        options = this.getConfig('./config/Axis.js/config.yml');

        this.versions = ['1.6.0'];
        this.commands = this.setCommands();
    }

    async onStart(Client) {
        // Change logger
        log = Client.AxisUtility.get().logger;

        SafeMessage.setLogger(log);
        SafeInteract.setLogger(log);

        log.log('Axis command module has starting!');
        
        await this.setPresence(Client);
        versionMessageReply = this.getVersionMessageReply(Client);

        if(options?.maxClientEventListeners || options?.maxClientEventListeners === 0) {
            log.warn(`Max client event listeners set to ${(options.maxClientEventListeners !== 0 ? options.maxClientEventListeners : 'infinite')}`);
            Client.setMaxListeners(options.maxClientEventListeners);
        }

        return true;
    }
    
    onLoad(Client) {
        log.warn("Axis command module has loaded!");

        fetchCommands(Client.AxisUtility.get().commands.MessageCommands);
        fetchCommands(Client.AxisUtility.get().commands.InteractionCommands);
    }

    getConfig(location) {
        return Yml.parse(MakeConfig(location, `# Toggle message commands
messageCommands:
  version:
    enabled: true
  stop:
    enabled: false
  help:
    enabled: true

# Toggle interaction commands
interactionCommands:
  version:
    enabled: true
  stop:
    enabled: true
  help:
    enabled: true

# Set bot presence
presence:
  enabled: true  # Enable presence
  status: ['online']  # Status of bot (online, idle, dnd, offline)  [this can be a string or an object for random value]
  type: ['playing']  # Type of status (playing, listening, watching, streaming) or enter a custom status  [this can be a string or an object for random value]
  activityName: ['Minecraft']  # Name your activity [this can be a string or an object for random value]

# Version command response
version:
  # The message to display when the version command is used
  message: |-
      **{username} v{version}**
      Based on Axis bot v{version}.
      https://github.com/FalloutStudios/Axis

  # Buttons to display in the version command
  linkButtons:
    - name: View on Github
      link: https://github.com/FalloutStudios/Axis
    - name: Submit an issue
      link: https://github.com/FalloutStudios/Axis/issues
    - name: View wiki
      link: https://github.com/FalloutStudios/Axis/wiki

# Only change this value if you know what you're doing.
#     not setting a value uses the default
# 0 - means infinite event listeners can be used
#     changing this to infinite or exceeding to the default value
#     can cause memory leaks.
maxClientEventListeners:`));
    }

    setCommands() {
        let registerCommands = [];
    
        // Version Command
        const setCommandVersion = () => {
            if(options?.messageCommands.version.enabled)
                registerCommands = registerCommands.concat([
                    new MessageCommandBuilder()
                        .setName('version')
                        .setDescription('Displays the current version of your Axis bot.')
                        .setExecute((args, message, Client) => SafeMessage.reply(message, versionMessageReply))
                ]);
            if(options?.interactionCommands.version.enabled)
                registerCommands = registerCommands.concat([
                    new InteractionCommandBuilder()
                        .setAllowExecuteViaDm(true)
                        .setCommand(SlashCommandBuilder => SlashCommandBuilder
                            .setName('version')
                            .setDescription('Displays the current version of your Axis bot.')
                        )
                        .setExecute((interaction, Client) => SafeMessage.reply(interaction, versionMessageReply))
                ])
        }
    
        // Help Command
        const setCommandHelp = () => {
            if(options?.messageCommands.help.enabled)
                registerCommands = registerCommands.concat([
                    new MessageCommandBuilder()
                        .setName('help')
                        .setDescription('Get command help')
                        .addArgument('filter', false, 'Filter commands')
                        .setExecute(async (args, message, Client) => getHelpMessage(args, message, Client))
                ]);
            if(options?.interactionCommands.help.enabled)
                registerCommands = registerCommands.concat([
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
                ])
        }
    
        // Stop Command
        const setCommandStop = () => {
            if(options?.messageCommands.stop.enabled)
                registerCommands = registerCommands.concat([
                    new MessageCommandBuilder()
                        .setName('stop')
                        .setDescription('Stop the bot')
                        .setExecute(async (args, message, Client) => { await SafeMessage.reply(message, this.StopMessage(Client)); process.exit(0); })
                ]);
            if(options?.interactionCommands.stop.enabled)
                registerCommands = registerCommands.concat([
                    new InteractionCommandBuilder()
                        .setCommand(SlashCommandBuilder => SlashCommandBuilder
                            .setName('stop')
                            .setDescription('Stop the bot')
                        )
                        .setExecute(async (interaction, Client) => { await SafeInteract.reply(interaction, this.StopMessage(Client)); process.exit(0); })
                ]);
        }

        setCommandVersion();
        setCommandStop();
        setCommandHelp();
    
        return registerCommands;
    }

    async setPresence(Client) {
        log.log('Configuring bot presence...');
    
        return options?.presence.enabled ? Client.user.setPresence({
            status: Util.getRandomKey(options.presence.status),
            activities: [{
                name: Util.getRandomKey(options.presence.activityName),
                type: Util.getRandomKey(options.presence.type)
            }]
        }) : null;
    }

    getVersionMessageReply(Client) {
        const buttons = new MessageActionRow();
    
        for (const button of options.version.linkButtons) {
            buttons.addComponents(
                new MessageButton()
                    .setStyle("LINK")
                    .setLabel(button.name)
                    .setURL(button.link)
            );
        }
    
        let strMessage = Util.getRandomKey(options.version.message);
        strMessage = Util.replaceAll(strMessage, '{username}', Client.user.username);
        strMessage = Util.replaceAll(strMessage, '{tag}', Client.user.tag);
        strMessage = Util.replaceAll(strMessage, '{version}', Version);
    
        return { content: strMessage, components: [buttons] };
    }

    StopMessage(Client) {
        log.warn("Stopping...");
        return Util.getRandomKey(Client.AxisUtility.get().language.stop);
    }
}

module.exports = new AxisCommands();

// functions
// Help command
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
                .setAuthor({ name: Util.getRandomKey(language.help.title), iconURL: client.user.displayAvatarURL() })
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
        visibleCommands = filterVisibleCommands(visibleCommands, filter, message.member, Client.AxisUtility.get().config.permissions.messageCommands);
    
    // Create embeds
    let embeds = makePages(visibleCommands, commands.MessageCommands, Client, Client.AxisUtility.get().language, Client.AxisUtility.get().config.commandPrefix, Client.AxisUtility.get().config.embedColor);
    
    if(embeds.length == 1) {
        await SafeMessage.send(message.channel, { embeds: embeds });
    } else {
        await new Pagination(message.channel, embeds, "Page", interactionTimeout, [
            {
                style: "SECONDARY",
                label: "Start",
                emoji: ""
            },
            {
                style: "PRIMARY",
                label: "Previous",
                emoji: ""
            },
            {
                style: "DANGER",
                label: "Cancel",
                emoji: ""
            },
            {
                style: "SUCCESS",
                label: "Next",
                emoji: ""
            },
            {
                style: "SECONDARY",
                label: "Last",
                emoji: ""
            },
        ]).paginate().catch(err => log.error(err));
    }
}
async function getHelpInteraction(interaction, Client) {
    let filter = !interaction.options.getString('filter') ? '' : interaction.options.getString('filter');
    let visibleCommands = Object.keys(commands.InteractionCommands);
        visibleCommands = filterVisibleCommands(visibleCommands, filter, interaction.member, Client.AxisUtility.get().config.permissions.interactionCommands);
    
    // Create embeds
    let embeds = makePages(visibleCommands, commands.InteractionCommands, Client, Client.AxisUtility.get().language, '/', Client.AxisUtility.get().config.embedColor);
    
    // Create buttons
    const buttons = [
        new MessageButton()
            .setCustomId("previousbtn")
            .setLabel("Previous")
            .setStyle("PRIMARY"),
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
        await InteractionPaginationEmbed(interaction, embeds, buttons, interactionTimeout).catch( err => log.error(err));
    }
}