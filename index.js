/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##     ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  

    ClassNames: PascalCase
    PropertyNames: camelCase
    VariableNames: camelCase (Constants<Imports>: PascalCase )
    FunctionNames: camelCase
**/

require('./scripts/startup')();

// Modules
const Util = require('fallout-utility');
const Path = require('path');
const Config = require('./scripts/config');
const Language = require('./scripts/language');
const Discord = require('discord.js');

// Local actions
const ScriptLoader = require('./scripts/loadScripts');
const SafeMessage = require('./scripts/safeMessage');
const SafeInteract = require('./scripts/safeInteract');
const CommandPermission = require('./scripts/commandPermissions');
const MemberPermission = require('./scripts/memberPermissions');

// Configurations
const log = new Util.Logger('Bot');
const registerInteractionCommmands = require('./scripts/registerInteractionCommands');

// Config
let config = new Config('./config/config.yml').parse().testmode().prefill().getConfig();

// Language
let lang = new Language(config.language).parse().getLanguage();


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
        const cmd = this.getCommands().MessageCommands.find(property => property.name === command);
        const args = Util.getCommand(message.content.trim(), this.getConfig().commandPrefix).args;

        // If the command exists
        if(!cmd) return;

        // Check permission
        if(!CommandPermission(command, message.member, this.getConfig().permissions.messageCommands)) {
            return SafeMessage.reply(message, Util.getRandomKey(this.getLanguage().noPerms));
        }

        // Execute
        await this.executeMessageCommand(command, message, args).catch(async err => log.error(err, `${this.getConfig().commandPrefix}${command}`));
    }

    /**
     * 
     * @param {Object} interaction - Interaction object
     * @returns {Promise<void>}
     */
    async interactionCommand(interaction) {
        // Execute commands
        const cmd = interaction.isCommand() ? commands.InteractionCommands.find(property => property.name === interaction.commandName) : null;
        
        // If command exists
        if(!cmd) return;

        // Check configurations
        if(MemberPermission.isIgnoredChannel(interaction.channelId, this.getConfig().blacklistChannels) || !cmd.allowExecViaDm && !interaction?.member) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.getLanguage().notAvailable), ephemeral: true });
        }

        // Check permission
        if(!CommandPermission(interaction.commandName, interaction.member, this.getConfig().permissions.interactionCommands)) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.getLanguage().noPerms), ephemeral: true });
        }

        await this.executeInteractionCommand(interaction.commandName, interaction).catch(err => log.error(err, `/${interaction.commandName}`));
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

        log.warn(`${message.author.username} executed ${this.getConfig().commandPrefix}${command.name}`, 'MessageCommand');
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

        log.warn(`${ (interaction?.user.username ? interaction.user.username + ' ' : '') }executed /${interaction.commandName}`, 'InteractionCommand');
        await command.execute(interaction, Client);
    }

    /**
     * 
     * @param {Object} bot - Client object
     * @returns {string}
     */
    createInvite(bot) {
        return Util.replaceAll(this.getConfig().inviteFormat, '%id%', bot.user.id);
    }

    /**
     * 
     * @param {string} directory - directory to search
     * @returns {Promise<Object>} returns the loaded scripts files
     */
     async loadModules(directory) {
        const scriptsLoader = await ScriptLoader(Client, Path.join(__dirname, directory));

        scripts = scriptsLoader.scripts;
        commands = scriptsLoader.commands;
        
        await registerInteractionCommmands(Client, commands.InteractionCommands, config.guildId, false);
        
        // Execute .loaded method of every scripts
        for(const script in scripts) {
            if(!scripts[script]?.loaded) continue;
            await Promise.resolve(scripts[script].loaded(Client));
        }

        return scriptsLoader;
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

// Client start
Client.login(config.token);
Client.AxisUtility = new AxisUtility();

Client.on('ready', async () => {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Client.AxisUtility.createInvite(Client) }\n`, 'Invite');

    // Register interaction commands
    await Client.AxisUtility.loadModules(config.modulesFolder);

    // On command execution
    Client.on('interactionCreate', async interaction => Client.AxisUtility.interactionCommand(interaction));
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

// Errors and warnings
if(config.processErrors) {
    if(config.processErrors.clientShardError) Client.on('shardError', error => log.error(error, 'ShardError'));

    if(config.processErrors.processUncaughtException) process.on("unhandledRejection", reason => log.error(reason, 'Process'));
    if(config.processErrors.processUncaughtException) process.on("uncaughtException", (err, origin) => log.error(err, 'Process') && log.error(origin, 'Process'));
    if(config.processErrors.processWarning) process.on('warning', warn => log.warn(warn, 'Process'));
}