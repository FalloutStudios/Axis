/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##    ## 
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

const log = Util.logger;
    log.defaultPrefix = 'Bot';
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

Client.login(config.token);
const Actions = new actions();

var modulesList = {};
var scripts = {};

Client.on('ready', function() {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Actions.createInvite(Client) }\n`, 'Invite');

    Actions.loadScripts();

    Client.on('messageCreate', async function (message) {
        if(message.author.id === Client.user.id || message.author.bot || message.author.system) return;

        log.log(message.author.username + ': ' + message.content, 'Message');
        if(Util.detectCommand(message.content, config.commandPrefix)){
            const commandConstructor = Util.getCommand(message.content, config.commandPrefix);
            const command = commandConstructor.command.toLowerCase();

            // Ignored channels
            if(
                config.blacklistChannels.enabled && !config.blacklistChannels.convertToWhitelist && config.blacklistChannels.channels.includes(message.channelId.toString())
                || 
                config.blacklistChannels.enabled && config.blacklistChannels.convertToWhitelist && !config.blacklistChannels.channels.includes(message.channelId.toString())
            ) return;

            // Execute command
            if(scripts.hasOwnProperty(command)){
                Actions.command(command, message);
            }
        }
    });
});

function actions() {
    // scripts
    this.reload = (message) => {
        parseConfig.parse();
        config = parseConfig.config;
    
        language.parse();
        lang = language.language;
    
        Client.login(config.token).then(function () {
            if(typeof message !== 'undefined') Actions.reply(message, language.get(lang.reload.success));
            Actions.loadScripts();
        }).catch(err => {
            log.error(err, 'Reload');
            if(typeof message !== 'undefined') Actions.reply(message, language.get(lang.error) + '\n```\n' + err.message + '\n```');
        });

        return {
            language: lang,
            config: config
        };
    }
    this.loadScripts = () => {
        scripts = {};
        modulesList = Fs.readdirSync(__dirname + '/modules/').filter(file => file.endsWith('.js'));

        for (const file of modulesList) {
            let name = Path.parse(file).name;
            let path = __dirname + '/modules/' + file;
            
            if(Object.keys(require.cache).find(module => module == path)) delete require.cache[path];
            let importModule = require(path);
            
            try {
                name = Util.replaceAll(name, ' ', '_').toLowerCase();

                if(!importModule.versions || importModule.versions && !importModule.versions.find(version => version == config.version)) { log.error(`${file} does not support bot version ${config.version}`, file); continue; }

                scripts[name] = importModule;
                if(scripts[name].start(Client, Actions, config, lang)) log.log('Ready! command: ' + name, file);
            } catch (err) {
                log.error(`Coudln't load ${file}: ${err.message}`, file);
                log.error(err, file);
            }
        }
    }
    this.command = (command, message) => {
        const args = Util.getCommand(message.content.trim(), config.commandPrefix).args;

        log.warn(message.author.username + ' executed ' + command);

        if(config.adminOnlyCommands.find(key => key.toLowerCase() == command) && !this.admin(message.member)) { 
            this.reply(message, language.get(lang.noPerms)); return; 
        }
        if(config.moderatorOnlyCommands.find(key => key.toLowerCase() == command) && !this.moderator(message.member)) { 
            this.reply(message, language.get(lang.noPerms)); return; 
        }
        if(typeof scripts[command].execute === 'undefined') { log.warn(command + ' is not a command'); return; } 

        scripts[command].execute(args, message, Actions, Client).catch(async err => {
            log.error(err, command + '.js');
            await this.send(message.channel, language.get(lang.error) + '\n```\n' + err.message + '\n```');
        });
    }

    // Other utility functions
    this.get = (object) => {
        return language.get(object);
    }
    this.createInvite = (bot) => {
        return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
    }
    
    // Permissions
    this.admin = (member) => {
        if(member && member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return true;
        return false;
    }
    this.moderator = (member) => {
        if(member && member.permissions.has([Discord.Permissions.FLAGS.BAN_MEMBERS, Discord.Permissions.FLAGS.KICK_MEMBERS])) return true;
        return false;
    }

    // Safe execute
    this.send = async (channel, message) => {
        try {
            return await channel.send(message).catch(err => { log.error(err, 'Send error'); });
        } catch (err) {
            log.error(err, 'Send error');
            return false;
        }
    }
    this.reply = async (message, reply) => {
        try {
            return await message.reply(reply).catch(err => { log.error(err, 'Reply error'); });
        } catch (err) {
            log.error(err, 'Reply error');
            return false;
        }
    }
    this.delete = async (message) => {
        try {
            return await message.delete().catch( err => { log.error(err, 'Delete error'); });
        } catch (err) {
            log.error(err, 'Delete error');
        }
    }
    this.react = async (message, reaction) => {
        try {
            return await message.react(reaction).catch( err => { log.error(err, 'Reaction error'); });
        } catch (err) {
            log.error(err, 'Reaction error');
            return false;
        }
    }
}