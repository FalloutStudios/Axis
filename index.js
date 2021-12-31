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

const configPath = './config/Bot/config.yml';
const languagePath = './config/Bot/language.yml';


// Modules
const Util = require('fallout-utility');
const Path = require('path');
const Discord = require('discord.js');

// Local modules
const { Config, Language } = require('./scripts/config');
const { SafeMessage, SafeInteract } = require('./scripts/safeActions');
const CommandPermission = require('./scripts/commandPermissions');
const MemberPermission = require('./scripts/memberPermissions');
const ScriptLoader = require('./scripts/loadScripts');

// Utils
const log = new Util.Logger('Main');
const registerInteractionCommmands = require('./scripts/registerInteractionCommands');

// Config & Language
let config = new Config(configPath).parse().commands().prefill().getConfig();
let lang = new Language(config?.language ? config.language : languagePath).parse().getLanguage();


// Client
const Client = new Discord.Client(config.client);

// Data
var scripts = {};
var commands = { MessageCommands: [], InteractionCommands: [] };
var intents = config.client.intents;


// Logging
if(config.logging.enabled) {
    log.logFile(config.logging.logFilePath);

    SafeMessage.setLogger(log);
    SafeInteract.setLogger(log);
}


// Startup
require('./scripts/startup')(log);


// AxisUtility
class AxisUtility {
    /**
     * 
     * @param {string} command - command name
     * @param {Object} message - message object
     * @returns {Promise<void>}
     */
    async messageCommand(command, message) {
        const cmd = this.get().commands.MessageCommands.find(property => property.name === command);
        const args = Util.getCommand(message.content.trim(), this.get().config.commandPrefix).args;

        // If the command exists
        if(!cmd) return false;

        // Check permission
        if(!CommandPermission(command, message.member, this.get().config.permissions.messageCommands)) {
            return SafeMessage.reply(message, Util.getRandomKey(this.get().language.noPerms));
        }

        // Execute
        return this.executeMessageCommand(command, message, args).catch(async err => log.error(err, `${this.get().config.commandPrefix}${command}`));
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
        if(!cmd) return false;

        // Check configurations
        if(MemberPermission.isIgnoredChannel(interaction.channelId, this.get().config.blacklistChannels) || !cmd.allowExecViaDm && !interaction?.member) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.get().language.notAvailable), ephemeral: true });
        }

        // Check permission
        if(!CommandPermission(interaction.commandName, interaction.member, this.get().config.permissions.interactionCommands)) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.get().language.noPerms), ephemeral: true });
        }

        return this.executeInteractionCommand(interaction.commandName, interaction).catch(err => log.error(err, `/${interaction.commandName}`));
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

        log.warn(`${message.author.username} executed ${this.get().config.commandPrefix}${command.name}`, 'MessageCommand');
        return command.execute(args, message, Client);
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
        return command.execute(interaction, Client);
    }

    /**
     * 
     * @param {Object} bot - Client object
     * @returns {string}
     */
    createInvite(bot) {
        return Util.replaceAll(this.get().config.inviteFormat, '%id%', bot.user.id);
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
            if(!scripts[script]?.onLoad) continue;
            await Promise.resolve(scripts[script].onLoad(Client));
        }

        return scriptsLoader;
    }

    /**
     * 
     * @returns {Object[]} returns the loaded scripts and bot configurations
     */
    get() {
        return {
            logger: log,
            intents: intents,
            commands: commands,
            scripts: scripts,
            config: config,
            language: lang
        }
    }

    /**
     * 
     * @returns {Object} returns methods to parse configurations
     */
    parse() {
        return {
            /**
             * @returns {void}
             */
            config() {
                config = new Config(configPath).parse().testmode().getConfig();
            },

            /**
             * @returns {void}
             */
            language() {
                lang = new Language(config.language).parse().getLanguage();
            }
        }
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
        if(config.messageLogging.enabled && (!config.messageLogging.ignoreBotSystem || config.messageLogging.ignoreBotSystem && !(message.author.bot || message.author.system))) log.log(`${message.author.username}: ${message.content}`, 'Message');
        if(message.author.id === Client.user.id || message.author.bot || message.author.system || MemberPermission.isIgnoredChannel(message.channelId, config.blacklistChannels)) return;

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

    process.on("unhandledRejection", reason => {
        log.error(reason, 'unhandledRejection');

        if(!config.processErrors.processUncaughtException) setTimeout(() => process.exit(1), 10);
    });
    process.on("uncaughtException", (err, origin) => {
        log.error(err, 'uncaughtException');
        log.error(origin, 'uncaughtException');

        if(config.processErrors.processUncaughtException) setTimeout(() => process.exit(1), 10);
    });

    process.on('warning', warn => {
        log.warn(warn, 'Warning');
        if(config.processErrors.processWarning) setTimeout(() => process.exit(1), 10);
    });

    process.on('exit', code => {
        log.warn(`Process exited with code ${code}`, 'Status');
    });
}

// Exit Events
process.on('SIGINT', () => process.exit(0));
process.on('SIGUSR1', () => process.exit(0));
process.on('SIGUSR2', () => process.exit(0));