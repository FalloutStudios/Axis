// Modules
const Yml = require('yaml');
const MakeConfig = require('../makeConfig');
const Commander = require('commander');
const Version = require('../version');
const { input } = require('fallout-utility');

const commands = new Commander.Command;
    commands.option('-t, --testmode', 'Use "discordtoken" environment as a token');
    commands.option('-L, --logging <value>', 'Toggle log file (True/False)', true);
    commands.option('-l, --logFilePath <logFilePath>', 'Log file path', './logs/latest.log');
    commands.parse();

module.exports = class Config {
    /**
     * @param {string} location config file location
     */
    constructor(location) {
        this.location = location;
        this.config = null;
    }

    /**
     * @returns {Object} returns modified config
     */ 
    parse() {
        if(!this.location || this.location == null) throw new Error('No config file path provided');

        const config = Yml.parse(MakeConfig(this.location, generateConfig()));

        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        this.config = config;

        return this
    }

    /**
     * @returns {Object} returns modified config
     */
    commands() {
        if(typeof commands.opts().logging === 'string' && (commands.opts().logging.toLowerCase() == 'false' || commands.opts().logging.toLowerCase() == 'true')) {
            var logging = { status: commands.opts().logging.toLowerCase() == 'true' ? true : false };
        }

        this.config.token = commands.opts().testmode ? process.env['discordtoken'] : this.config.token;
        this.config.logging.enabled = logging ? logging.status : this.config.logging.enabled;
        this.config.logging.logFilePath = commands.opts().logFilePath ? commands.opts().logFilePath : this.config.logging.logFilePath;

        return this;
    }

    /**
     * @returns {Object} returns modified config
     */
    prefill() {
        this.config.token = this.config.token === 'TOKEN' ? null : this.config.token;
        this.config.token = !this.config.token || this.config.token == null ? input({ text: 'Bot Token >>> ', echo: '*', repeat: true }) : this.config.token;

        return this;
    }

    /**
     * @returns {Object} returns parsed config
     */
    getConfig() {
        return this.config;
    }
}


function generateConfig() {
    return `token: TOKEN # Bot token

embedColor: '#19AFFF'  # Colors for embed messages
commandPrefix: '!'  # Prefix for commands
owner: 'FalloutStudios'  # Who owns this bot

guildId: '' # Only register slash commands for the given guild.

# Command permissions
permissions:
  # Message commands permissions
  messageCommands:
    # Enable message command permissions
    enabled: true

    # Commands
    commands:
      - command: 'stop'
        permissions: ['ADMINISTRATOR']
  
  # Slash commands permissions
  interactionCommands:
    # Enable slash commands permissions
    enabled: true

    # Register slash commands
    registerSlashCommands: true

    # Commands
    commands:
      - command: 'stop'
        permissions: ['ADMINISTRATOR']

# Ignored channels based on IDs
blacklistChannels:            
  enabled: false  # Enable blacklisted channels

  # List of blacklisted channels
  channels: []
  convertToWhitelist: false  # Convert channels to whitelisted channels

# ==========================================================
#                       Danger Zone!                          
#    Edit this values below if you know what you're doing
# ==========================================================

# Logging
logging:
  enabled: true # Enable logging
  logFilePath: './logs/latest.log' # Log file directory

# Message logging (This is is against Discord TOS!!!) use for testing porpuses only
messageLogging:
  enabled: false # Enable logging
  ignoreBotSystem: true # Ignore bot chats

# process errors logging. (Few options can stop some crashes)
processErrors:
  clientShardError: true
  processWarning: true
  processUnhandledRejection: false
  processUncaughtException: false

client:
  # Bot intents
  intents:
    - 'GUILDS'
    - 'GUILD_MEMBERS'
    - 'GUILD_INVITES'
    - 'GUILD_VOICE_STATES'
    - 'GUILD_MESSAGES'
    - 'GUILD_MESSAGE_REACTIONS'

inviteFormat: https://discord.com/oauth2/authorize?client_id=%id%&permissions=8&scope=bot%20applications.commands   # Invite format for bot
language: 'config/Bot/language.yml'   # Langage file 
modulesFolder: 'modules'  # Define where's your modules (Changing this might cause problems to other modules)

version: ${Version}    # Version (don't modify this value)`;
}