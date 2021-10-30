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
const ScriptLoader = require('./scripts/loadScripts');
const SafeMessage = require('./scripts/safeMessage');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const deployFile = './deploy.txt';
const log = new Util.Logger('Bot');
const parseConfig = new Config();
    parseConfig.location = './config/config.yml';
    parseConfig.parse();
    parseConfig.testmode();
    parseConfig.prefill();
let config = parseConfig.config;
const language = new Language();
    language.location = config.language;
    language.parse();
let lang = language.language;

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

var scripts = {};
var commands = [];
Client.commands = new Discord.Collection();

class UtilActions {
    // scripts
    async loadScripts() {
        const scriptsLoader = await ScriptLoader(Path.join(__dirname, config.modulesFolder), Actions, config, lang, Client);

        scripts = scriptsLoader.scripts;
        commands = scriptsLoader.commands;
    }

    // Commands
    async messageCommand(command, message) {
        let perms = true;

        const args = Util.getCommand(message.content.trim(), config.commandPrefix).args;
        log.warn(`${message.author.username} executed ${config.commandPrefix}${command}`, 'message Command');

        // Check permissions
        if(config.permissions.adminOnlyCommands.find(key => key.toLowerCase() == command) && !Actions.admin(message.member)) perms = false;
        if(config.permissions.moderatorOnlyCommands.find(key => key.toLowerCase() == command) && !Actions.moderator(message.member)) perms = false;
        if(typeof scripts[command].execute === 'undefined') { log.warn(`${command} is not a command`); return; } 

        // No permission
        if(!perms) { SafeMessage.reply(message, language.get(lang.noPerms)); return; }

        // Execute
        await scripts[command].execute(args, message, Client, Actions).catch(async err => {
            log.error(err, `${config.commandPrefix}${command}`);
            await this.send(message.channel, language.get(lang.error) + '\n```\n' + err.message + '\n```');
        });
    }
    async registerInteractionCommmands(client, force = false, guild = null) {
        if(!config.slashCommands.enabled) return;
        if(Fs.existsSync(deployFile) && !force && !guild) {
            const deploy = Fs.readFileSync(deployFile).toString().trim();

            if(deploy == 'false') {
                return;
            }

            Fs.writeFileSync(deployFile, 'false');
        } else {
            Fs.writeFileSync(deployFile, 'false'); 
        }

        const rest = new REST({ version: '9' }).setToken(config.token);
        (async () => {
            try {
                if(!guild){
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        { body: commands },
                    );
                    log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a global scale.`, 'Register Commands');
                } else {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild),
                        { body: commands },
                    );
                    log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a guild.`, 'Register Commands');
                }
            } catch (err) {
                log.error(err, 'Register Commands');
            }
        })();
    }

    // Other utility functions
    get(object) {
        return language.get(object);
    }
    createInvite(bot) {
        return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
    }
    
    // Permissions
    admin(member) {
        if(member && member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return true;
        return false;
    }
    moderator(member) {
        if(member && member.permissions.has([Discord.Permissions.FLAGS.BAN_MEMBERS, Discord.Permissions.FLAGS.KICK_MEMBERS])) return true;
        return false;
    }
    isIgnoredChannel(channelId) {
        if(
            config.blacklistChannels.enabled && !config.blacklistChannels.convertToWhitelist && config.blacklistChannels.channels.includes(channelId.toString())
            || 
            config.blacklistChannels.enabled && config.blacklistChannels.convertToWhitelist && !config.blacklistChannels.channels.includes(channelId.toString())
        ) { return true; }
        return false;
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
    await Actions.registerInteractionCommmands(Client, false, config.guildId);
});

Client.on('ready', function() {
    // On Interaction commands
    Client.on('interactionCreate', async (interaction) => {
        if(!interaction.isCommand() || !interaction.member) return;

        let command = scripts[Client.commands.get(interaction.commandName)];
        if (!command) return;
        
        // Check configurations
        if(!config.slashCommands.enabled || Actions.isIgnoredChannel(interaction.channelId)) { await interaction.reply({ content: language.get(lang.notAvailable), ephemeral: true }).catch(err => log.error(err)); return; }
        log.warn(`${interaction.member.user.username} executed ${interaction.commandName}`, 'Slash command');

        try {
            await command['slash'].execute(interaction, Client, Actions);
        } catch (err) {
            log.error(err, 'Interaction');
        }
    });

    // On Message
    Client.on('messageCreate', async (message) => {
        if(message.author.id === Client.user.id || message.author.bot || message.author.system) return;
        log.log(`${message.author.username}: ${message.content}`, 'Message');

        // Message commands
        if(Util.detectCommand(message.content, config.commandPrefix)){
            const commandConstructor = Util.getCommand(message.content, config.commandPrefix);
            const command = commandConstructor.command.toLowerCase();

            // Ignored channels
            if(Actions.isIgnoredChannel(message.channelId)) return;

            // Execute command
            if(scripts.hasOwnProperty(command)){
                Actions.messageCommand(command, message);
            }
        }
    });
});

// Client error
Client.on('shardError', (error) => { log.error(error); });

// Process warning
process.on('warning', (warn) => log.warn(warn));