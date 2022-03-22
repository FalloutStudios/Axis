#!/usr/bin/env node

/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##     ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  
**/

require('module-alias/register');

const configPath = './config/Bot/config.yml';
const languagePath = './config/Bot/language.yml';


// Modules
const Util = require('fallout-utility');
const Discord = require('discord.js');
const AxisUtility = require('@utils/Utility');
const MemberPermissions = require('@utils/memberPermissions');

// Local modules
const { SafeMessage, SafeInteract } = require('@utils/safeActions');

// Utils
const log = new Util.Logger('Main');

// Config & Language
try {
    const { Config, Language } = require('@utils/config');
    var config = new Config(configPath).parse().commands().prefill().getConfig();
    var lang = new Language(config?.language ? config.language : languagePath).parse().getLanguage();
} catch (err) {
    log.error('\n============== This is not logged! ==============\n');
    log.error('An error occured while loading the config or language files.');
    log.error('Please check the config and language files and try again.');
    log.error(err);
    log.error('\n================================================\n');
    process.exit(1);
}

// Client
const Client = new Discord.Client(config.client);


// Logging
if(config.logging.enabled) {
    log.logFile(config.logging.logFilePath);

    SafeMessage.setLogger(log);
    SafeInteract.setLogger(log);
}


// Startup
require('@utils/startup')(log);


// Client start
Client.login(config.token);
Client.AxisUtility = new AxisUtility({ logger: log, config: config, language: lang, Client: Client });

Client.on('ready', async () => {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Client.AxisUtility.createInvite(Client) }\n`, 'Invite');

    // Load modules
    await Client.AxisUtility.loadModules(config.modulesFolder);

    // Command execution
    Client.on('interactionCreate', async interaction => Client.AxisUtility.interactionCommand(interaction));
    Client.on('messageCreate', async message => {
        if(config.messageLogging.enabled && (!config.messageLogging.ignoreBotSystem || config.messageLogging.ignoreBotSystem && !(message.author.bot || message.author.system))) log.log(`${message.author.username}: ${message.content}`, 'Message');
        if(message.author.id === Client.user.id || message.author.bot || message.author.system || MemberPermissions.isIgnoredChannel(message.channelId, config.blacklistChannels)) return;

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

        if(!config.processErrors.processUncaughtException) setTimeout(() => process.exit(1), 10);
    });

    process.on('warning', warn => log.warn(warn, 'Warning'));

    process.on('exit', code => {
        log.warn(`Process exited with code ${code}`, 'Status');
    });
}
