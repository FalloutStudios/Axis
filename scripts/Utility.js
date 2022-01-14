const Util = require('fallout-utility');
const Path = require('path');
const { Config, Language } = require('./config');
const { SafeMessage, SafeInteract } = require('./safeActions');
const LoadScripts = require('./loadScripts');
const CommandPermission = require('./commandPermissions');
const MemberPermissions = require('./memberPermissions');
const registerInteractionCommmands = require('./registerInteractionCommands');

module.exports = class AxisUtility {
    /**
     * 
     * @param {Object[]} options - options
     * @param {string} [options.logger=new Util.Logger()] - Logger object
     * @param {Object[]} options.config - Bot config.yml
     * @param {Object[]} options.language - Language config.yml
     * @param {Object[]} options.Client - Client object
     */
    constructor(options = { logger: new Util.Logger('AxisUtility'), config: null, language: null, Client: null }) {
        if(!options.config) throw new TypeError('No config provided');
        if(!options.language) throw new TypeError('No language provided');
        if(!options.Client) throw new TypeError('No client provided');

        this.logger = options.logger;
        this.config = options.config;
        this.language = options.language;
        this.scripts = {};
        this.commands = { MessageCommands: [], InteractionCommands: [] };
        this.Client = options.Client;
    }

    /**
     * 
     * @param {string} command - command name
     * @param {Object} message - message object
     * @returns {Promise<void>}
     */
    async messageCommand(command, message) {
        const cmd = this.commands.MessageCommands.find(property => property.name === command);
        const args = Util.getCommand(message.content.trim(), this.config.commandPrefix).args;

        // If the command exists
        if(!cmd) return false;

        // Check permission
        if(!CommandPermission(command, message.member, this.config.permissions.messageCommands)) {
            return SafeMessage.reply(message, Util.getRandomKey(this.language.noPerms));
        }

        // Execute
        return this.executeMessageCommand(command, message, args).catch(async err => this.logger.error(err, `${this.config.commandPrefix}${command}`));
    }

    /**
     * 
     * @param {Object} interaction - Interaction object
     * @returns {Promise<void>}
     */
    async interactionCommand(interaction) {
        // Execute commands
        const cmd = interaction.isCommand() ? this.commands.InteractionCommands.find(property => property.name === interaction.commandName) : null;
        
        // If command exists
        if(!cmd) return false;

        // Check configurations
        if(MemberPermissions.isIgnoredChannel(interaction.channelId, this.config.blacklistChannels) || !cmd.allowExecViaDm && !interaction?.member) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.language.notAvailable), ephemeral: true });
        }

        // Check permission
        if(!CommandPermission(interaction.commandName, interaction.member, this.config.permissions.interactionCommands)) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.language.noPerms), ephemeral: true });
        }

        return this.executeInteractionCommand(interaction.commandName, interaction).catch(err => this.logger.error(err, `/${interaction.commandName}`));
    }

    /**
     * 
     * @param {string} name - command name to execute
     * @param {Object} message - message object
     * @param {Object} args - command arguments
     * @returns {Promise<void>}
     */
    async executeMessageCommand(name, message, args) {
        const command = this.commands.MessageCommands.find(property => property.name === name);
        if(!command) throw new Error(`Command \`${name}\` does not exist`);

        this.logger.warn(`${message.author.username} executed ${this.config.commandPrefix}${command.name}`, 'MessageCommand');
        return command.execute(args, message, this.Client);
    }

    /**
     * 
     * @param {string} name - command name to execute
     * @param {Object} interaction - interaction object
     * @returns {Promise<void>}
     */
    async executeInteractionCommand(name, interaction) {
        const command = this.commands.InteractionCommands.find(property => property.name === name);
        if(!command) throw new Error(`Command \`${name}\` does not exist`);

        this.logger.warn(`${ (interaction?.user.username ? interaction.user.username + ' ' : '') }executed /${interaction.commandName}`, 'InteractionCommand');
        return command.execute(interaction, this.Client);
    }

    /**
     * 
     * @param {string} directory - directory to search
     * @returns {Promise<Object>} returns the loaded scripts files
     */
    async loadModules(directory) {
        const scriptsLoader = await LoadScripts(this.Client, Path.join(process.cwd(), directory));

        this.scripts = scriptsLoader.scripts;
        this.commands = scriptsLoader.commands;
        
        await registerInteractionCommmands(this.Client, this.commands.InteractionCommands, this.config.guildId, false);
        
        // Execute .loaded method of every scripts
        for(const script in this.scripts) {
            if(!this.scripts[script]?.onLoad) continue;
            await Promise.resolve(this.scripts[script].onLoad(this.Client));
        }

        return scriptsLoader;
    }

    /**
     * 
     * @param {Object} bot - Client object
     * @returns {string}
     */
    createInvite(bot) {
        return Util.replaceAll(this.config.inviteFormat, '%id%', bot.user.id);
    }

    /**
     * 
     * @returns {Object[]} returns the loaded scripts and bot configurations
     */
    get() {
        process.emitWarning('<AxisUtility>.get() is deprecated', 'DeprecationWarning');

        return {
            logger: this.logger,
            commands: this.commands,
            scripts: this.scripts,
            config: this.config,
            language: this.language,
            Client: this.Client
        }
    }

    /**
     * 
     * @returns returns methods to parse configurations
     */
    parse() {
        return {
            /**
             * @returns {void}
             */
            config() {
                this.language = new Config(configPath).parse().testmode().getConfig();
            },

            /**
             * @returns {void}
             */
            language() {
                this.language = new Language(this.config.language).parse().getLanguage();
            }
        }
    }
}