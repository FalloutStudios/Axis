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
const CommandPermission = require('./scripts/commandPermissions');
const MemberPermission = require('./scripts/memberPermissions');

// Public vars
const log = new Util.Logger('Bot');
const parseConfig = new Config('./config/config.yml');
let config = parseConfig.parse();
    config = parseConfig.testmode(config);
    config = parseConfig.prefill(config);
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
var commands = [];

// UtilActions
class UtilActions {
    // scripts
    async loadScripts() {
        const scriptsLoader = await ScriptLoader(Path.join(__dirname, config.modulesFolder), config, lang, Client);

        scripts = scriptsLoader.scripts;
        commands = scriptsLoader.commands;
    }

    async registerInteractionCommmands() {
        return registerInteractionCommmands(Client, config, commands, config.guildId, false)
    }

    // Commands
    async messageCommand(command, message) {
        const args = Util.getCommand(message.content.trim(), config.commandPrefix).args;

        // Check permissions
        if(typeof scripts[command].execute === 'undefined') return;

        // No permission
        if(!CommandPermission(command, message.member, config)) {
            SafeMessage.reply(message, Util.getRandomKey(lang.noPerms));
            return;
        }

        log.warn(`${message.author.username} executed ${config.commandPrefix}${command}`, 'message Command');

        // Execute
        await scripts[command].execute(args, message, Client).catch(async err => {
            log.error(err, `${config.commandPrefix}${command}`);
            await SafeMessage.send(message.channel, Util.getRandomKey(lang.error) + '\n```\n' + err.message + '\n```');
        });
    }

    // Other utility functions
    createInvite(bot) {
        return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
    }
}

Client.login(config.token);
const Actions = new UtilActions();

// Client ready
Client.once('ready', async () => {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Actions.createInvite(Client) }\n`, 'Invite');
    
    // Register commands
    await Actions.loadScripts();
    await Actions.registerInteractionCommmands();
});

Client.on('ready', function() {
    // On Interaction commands
    Client.on('interactionCreate', async (interaction) => {
        // Execute commands
        if(!interaction.isCommand() || !interaction.member) return;

        let command = scripts[interaction.commandName]?.slash;
        if (!command) return;
        
        // Check configurations
        if(!config.slashCommands.enabled || MemberPermission.isIgnoredChannel(interaction.channelId, config.isIgnoredChannel)) { 
            await interaction.reply({ 
                content: Util.getRandomKey(lang.notAvailable),
                ephemeral: true
            }).catch(err => log.error(err));
            return; 
        }
        if(!CommandPermission(command['command']['name'], interaction.member, config)) { 
            interaction.reply({ 
                content: Util.getRandomKey(lang.noPerms),
                ephemeral: true
            }).catch(err => log.error(err, 'Slash command'));
            return;
        }

        log.warn(`${interaction.member.user.username} executed ${interaction.commandName}`, 'Slash command');

        try {
            await command.execute(interaction, Client);
        } catch (err) {
            log.error(err, 'Interaction');
        }
    });

    // On Message
    Client.on('messageCreate', async (message) => {
        if(message.author.id === Client.user.id || message.author.bot || message.author.system) return;

        // Ignored channels
        if(MemberPermission.isIgnoredChannel(message.channelId, config.isIgnoredChannel)) return;

        log.log(`${message.author.username}: ${message.content}`, 'Message');

        // Message commands
        if(Util.detectCommand(message.content, config.commandPrefix)){
            const commandConstructor = Util.getCommand(message.content, config.commandPrefix);
            const command = commandConstructor.command.toLowerCase();

            // Execute command
            if(scripts.hasOwnProperty(command)){
                Actions.messageCommand(command, message);
            }
        }
    });
});

// Errors
Client.on('shardError', (error) => { log.error(error); });
process.on('warning', (warn) => log.warn(warn));