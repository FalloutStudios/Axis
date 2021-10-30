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
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Local actions
const ScriptLoader = require('./scripts/loadScripts');
const SafeMessage = require('./scripts/safeMessage');
const CommandPermission = require('./scripts/commandPermissions');
const MemberPermission = require('./scripts/memberPermissions');

// Public vars
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
        const scriptsLoader = await ScriptLoader(Path.join(__dirname, config.modulesFolder), Actions, config, lang, Client);

        scripts = scriptsLoader.scripts;
        commands = scriptsLoader.commands;
    }

    // Commands
    async messageCommand(command, message) {
        const args = Util.getCommand(message.content.trim(), config.commandPrefix).args;

        // Check permissions
        if(typeof scripts[command].execute === 'undefined') return;

        // No permission
        if(!CommandPermission(command, message.member, config, Actions)) {
            SafeMessage.reply(message, language.get(lang.noPerms));
            return;
        }

        log.warn(`${message.author.username} executed ${config.commandPrefix}${command}`, 'message Command');

        // Execute
        await scripts[command].execute(args, message, Client, Actions).catch(async err => {
            log.error(err, `${config.commandPrefix}${command}`);
            await this.send(message.channel, language.get(lang.error) + '\n```\n' + err.message + '\n```');
        });
    }
    async registerInteractionCommmands(client, force = false, guild = null) {
        // Deployment
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

        // Send
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
        // Execute commands
        if(!interaction.isCommand() || !interaction.member) return;

        let command = scripts[interaction.commandName]?.slash;
        if (!command) return;
        
        // Check configurations
        if(!config.slashCommands.enabled || MemberPermission.isIgnoredChannel(interaction.channelId, config)) { 
            await interaction.reply({ 
                content: language.get(lang.notAvailable),
                ephemeral: true
            }).catch(err => log.error(err));
            return; 
        }
        if(!CommandPermission(command['command']['name'], interaction.member, config, Actions)) { 
            interaction.reply({ 
                content: language.get(lang.noPerms),
                ephemeral: true
            }).catch(err => log.error(err, 'Slash command'));
            return;
        }

        log.warn(`${interaction.member.user.username} executed ${interaction.commandName}`, 'Slash command');

        try {
            await command.execute(interaction, Client, Actions);
        } catch (err) {
            log.error(err, 'Interaction');
        }
    });

    // On Message
    Client.on('messageCreate', async (message) => {
        if(message.author.id === Client.user.id || message.author.bot || message.author.system) return;

        // Ignored channels
        if(MemberPermission.isIgnoredChannel(message.channelId, config)) return;

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