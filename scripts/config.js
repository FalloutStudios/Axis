// Modules
const Yml = require('yaml');
const MakeConfig = require('./makeConfig');
const Commander = require('commander');
const Version = require('./version');
const { ask } = require('fallout-utility');

const commands = new Commander.Command;
    commands.option('-t, --testmode');
    commands.parse();

module.exports = class {
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
    testmode() {
        this.config.token = commands.opts().testmode ? process.env['discordtoken'] : this.config.token;

        return this;
    }

    /**
     * @returns {Object} returns modified config
     */
    prefill() {
        this.config.token = this.config.token === 'TOKEN' ? null : this.config.token;
        this.config.token = !this.config.token || this.config.token == null ? ask('Bot Token >>> ') : this.config.token;

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
owner: 'Ghexter'  # Who owns this bot

guildId: # Only register slash commands for the given guild.

# Command permissions
permissions:
  # Message commands permissions
  messageCommands:
    # Enable message command permissions
    enable: true

    # Restrict commands for admin only (This is the command name)
    adminOnlyCommands: ['stop']

    # Command for moderator with kick and ban perms (This is the command name)
    moderatorOnlyCommands: []
  
  # Slash commands permissions
  interactionCommands:
    # Enable slash commands permissions
    enable: true

    # Register slash commands
    registerSlashCommands: true

    # Restrict commands for admin only (This is the command name)
    adminOnlyCommands: ['stop']

    # Command for moderator with kick and ban perms (This is the command name)
    moderatorOnlyCommands: []

# Ignored channels based on IDs
blacklistChannels:            
  enabled: false  # Enable blacklisted channels

  # List of blacklisted channels
  channels: []
  convertToWhitelist: false  # Convert channels to whitelisted channels

# Custom bot presence
presence:
  enabled: true  # Enable presence
  status: ['online']  # Status of bot (online, idle, dnd, offline)  [this can be a string or an object for random value]
  type: ['playing']  # Type of status (playing, listening, watching, streaming) or enter a custom status  [this can be a string or an object for random value]
  activityName: ['Minecraft']  # Name your activity [this can be a string or an object for random value]


# Danger Zone!
# Edit this values below if you know what you're doing

# process errors logging. (Few options can stop some crashes)
processErrors:
  clientShardError: true
  processWarning: true
  processUnhandledRejection: false
  processUncaughtException: false

inviteFormat: https://discord.com/oauth2/authorize?client_id=%id%&permissions=8&scope=bot%20applications.commands   # Invite format for bot
language: 'config/language.yml'   # Langage file 
modulesFolder: 'modules'  # Define where's your modules (Changing this might cause problems to other modules)

version: ${Version}    # Version (don't modify this value)`;
}