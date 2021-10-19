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

Client.on('ready', function() {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ createInvite(Client) }\n`, 'Invite');

    Client.on('messageCreate', async function (message) {
        log.log(message.author.username + ': ' + message.content, 'Message');
        if(message.content == '!reload') {
            await message.reply(lang.reload.requested);
            reload(message);
        }
    });
});

function reload(message) {
    parseConfig.parse();
    parseConfig.prefill();
    config = parseConfig.config;

    language.parse();
    lang = language.language;
    
    try {
        Client.destroy();
    } catch (e) {
        message.reply(e.message);
    }

    Client.login(config.token).then(function () {
        message.reply(lang.reload.success);
    });
}
function createInvite(bot) {
    return Util.replaceAll(config.inviteFormat, '%id%', bot.user.id);
}