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
var commands = {};

Client.on('ready', function() {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Actions.createInvite(Client) }\n`, 'Invite');

    Actions.loadCommands();

    Client.on('messageCreate', async function (message) {
        if(message.author.id === Client.user.id || message.author.bot) return;

        log.log(message.author.username + ': ' + message.content, 'Message');
        if(Util.detectCommand(message.content, config.commandPrefix)){
            const commandConstructor = Util.getCommand(message.content, config.commandPrefix);
            const command = commandConstructor.command;
            const args = commandConstructor.args;

            if(commands.hasOwnProperty(command)){
                log.warn(message.author.username + ' executed ' + command)
                commands[command].execute(args, message, Actions, Client).catch(err => {
                    log.error(err, command + '.js');
                    message.channel.send(err.message);
                });
            }
        }
    });
});

function actions() {
    this.reload = (message) => {
        parseConfig.parse();
        config = parseConfig.config;
    
        language.parse();
        lang = language.language;
    
        Client.login(config.token).then(function () {
            message.reply(language.get(lang.reload.success));
        }).catch(err => {
            log.error(err, 'Reload');
            message.reply(language.get(lang.error) + '\n```\n' + err.message + '\n```');
        });
        
        this.loadCommands();

        return {
            language: lang,
            config: config
        };
    }
    this.loadCommands = () => {
        modulesList = Fs.readdirSync(__dirname + '/modules/').filter(file => file.endsWith('.js'));

        for (const file of modulesList) {
            let name = Path.parse(file).name;
    
            let importModule = require(__dirname + '/modules/' + file);
            
            try {
                name = Util.replaceAll(name, ' ', '_');
                commands[name] = importModule;
    
                if(commands[name].start(config, lang, Client)) log.log('Ready! command: ' + name, file);
            } catch (e) {
                log.error(`Coudln't load ${file}: ${e.message}`, file);
            }
        }
    }
    this.createInvite = (bot) => {
        return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
    }
    this.get = (object) => {
        return language.get(object);
    }
    this.admin = (message) => {
        if(message.member && message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return true;
        
        return false;
    }
}