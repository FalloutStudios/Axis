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
const Discord = require('discord.js');
const AxisUtility = require('./scripts/Utility');
const MemberPermissions = require('./scripts/memberPermissions');

// Local modules
const { SafeMessage, SafeInteract } = require('./scripts/safeActions');

// Utils
const log = new Util.Logger('Main');

// Config & Language
const { Config, Language } = require('./scripts/config');
let config = new Config(configPath).parse().commands().prefill().getConfig();
let lang = new Language(config?.language ? config.language : languagePath).parse().getLanguage();


// Client
const Client = new Discord.Client(config.client);


// Logging
if(config.logging.enabled) {
    log.logFile(config.logging.logFilePath);

    SafeMessage.setLogger(log);
    SafeInteract.setLogger(log);
}


// Startup
require('./scripts/startup')(log);


// Client start
Client.login(config.token);
Client.AxisUtility = new AxisUtility({ logger: log, config: config, language: lang, Client: Client });

Client.on('ready', async () => {
    log.warn('Client connected!', 'Status');
    log.warn(`\nInvite: ${ Client.AxisUtility.createInvite(Client) }\n`, 'Invite');

    // Register interaction commands
    await Client.AxisUtility.loadModules(config.modulesFolder);

    // On command execution
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