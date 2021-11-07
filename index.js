/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##     ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  
**/

require('./scripts/startup')();

// Modules
const Util = require('fallout-utility');
const Fs = require('fs');
const Path = require('path');
const Config = require('./scripts/config');
const Language = require('./scripts/language');
const Discord = require('discord.js');

// Local actions
const ScriptLoader = require('./scripts/loadScripts');
const registerInteractionCommmands = require('./scripts/registerInteractionCommands');
const SafeMessage = require('./scripts/safeMessage');
const SafeInteraction = require('./scripts/safeInteract');
const CommandPermission = require('./scripts/commandPermissions');
const MemberPermission = require('./scripts/memberPermissions');

// Configurations
const log = new Util.Logger('Bot');
const parseConfig = new Config('./config/config.yml');
let config = parseConfig.parse().testmode().prefill().getConfig();
const language = new Language(config.language);
let lang = language.parse();

// Client
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ]
});

// Commands
var scripts = {};
var commands = { MessageCommands: [], InteractionCommands: [] };

// AxisUtility
class AxisUtility {
    /**
     * 
     * @param {string} command - command name
     * @param {Object} message - message object
     * @returns {Promise<void>}
     */
    async messageCommand(command, message) {
        const args = Util.getCommand(message.content.trim(), config.commandPrefix).args;

        // No permission
        if(!CommandPermission(command, message.member, config.permissions.messageCommands)) {
            SafeMessage.reply(message, Util.getRandomKey(lang.noPerms));
            return;
        }

        // Execute
        await this.executeMessageCommand(command, message, args).catch(async err => log.error(err, `${config.commandPrefix}${command}`));
    }

    /**
     * 
     * @param {Object} interaction - Interaction object
     * @returns {Promise<void>}
     */
    async interactionCommand(interaction) {
        // Execute commands
        if(!interaction.isCommand() || !interaction.member) return;
        
        // Check configurations
        if(MemberPermission.isIgnoredChannel(interaction.channelId, config.blacklistChannels)) { 
            await SafeInteraction.reply(interaction, { content: Util.getRandomKey(lang.notAvailable), ephemeral: true });
            return; 
        }
        if(!CommandPermission(interaction.commandName, interaction.member, config.permissions.interactionCommands)) { 
            SafeInteraction.reply(interaction, { content: Util.getRandomKey(lang.noPerms), ephemeral: true });
            return;
        }

        await this.executeInteractionCommand(interaction.commandName, interaction).catch(err => log.error(err));
    }

    /**
     * 
     * @param {string} name - command name to execute
     * @param {Object} message - message object
     * @param {Object} args - command arguments
     * @returns {Promise<void>}
     */
    async executeMessageCommand(name, message, args) {
        const command = commands.MessageCommands.find(property => property.name === name);
        if(!command) throw new Error(`Command \`${name}\` does not exist`);

        log.warn(`${message.author.username} executed ${config.commandPrefix}${command.name}`, 'MessageCommand');
        await command.execute(args, message, Client);
    }

    /**
     * 
     * @param {string} name - command name to execute
     * @param {Object} interaction - interaction object
     * @returns {Promise<void>}
     */
    async executeInteractionCommand(name, interaction) {
        const command = commands.InteractionCommands.find(property => property.name === name);
        if(!command) throw new Error(`Command \`${name}\` does not exist`);

        log.warn(`${interaction.member.user.username} executed /${interaction.commandName}`, 'InteractionCommand');
        await command.execute(interaction, Client);
    }

    /**
     * 
     * @param {Object} bot - Client object
     * @returns {string}
     */
    createInvite(bot) {
        return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
    }

    /**
     * 
     * @returns {Object} Returns the language.yml in json
     */
    getLanguage() {
        return lang;
    }

    /**
     * 
     * @returns {Object} Returns the config.yml in json
     */
    getConfig() {
        return config;
    }

    /**
     * 
     * @returns {Object} Returns the loaded scripts files
     */
    getScripts() {
        return scripts;
    }

    /**
     * 
     * @returns {Object} Returns all the available commands
     */
    getCommands() {
        return commands;
    }
}

Client.login(config.token);
Client.AxisUtility = new AxisUtility();

// Client ready
Client.on('ready', async () => {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Client.AxisUtility.createInvite(Client) }\n`, 'Invite');

    // Register commands
    const scriptsLoader = await ScriptLoader(Client, Path.join(__dirname, config.modulesFolder));

    scripts = scriptsLoader.scripts;
    commands = scriptsLoader.commands;
    await registerInteractionCommmands(Client, commands.InteractionCommands, config.guildId, false);

    // Execute .loaded method of every scripts
    for(const script in scripts) {
        if(!scripts[script]?.loaded) continue;
        await scripts[script].loaded(Client);
    }

    // On Interaction commands
    Client.on('interactionCreate', async interaction => Client.AxisUtility.interactionCommand(interaction));

    // On Message
    Client.on('messageCreate', async message => {
        if(message.author.id === Client.user.id || message.author.bot || message.author.system || MemberPermission.isIgnoredChannel(message.channelId, config.blacklistChannels)) return;

        log.log(`${message.author.username}: ${message.content}`, 'Message');

        // Message commands
        if(Util.detectCommand(message.content, config.commandPrefix)){
            const commandConstructor = Util.getCommand(message.content, config.commandPrefix);
            const command = commandConstructor.command.toLowerCase();

            // Execute command
            Client.AxisUtility.messageCommand(command, message);
        }
    });
});

// Errors
Client.on('shardError', error => log.error(error));
process.on('warning', warn => log.warn(warn));