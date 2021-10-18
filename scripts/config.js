// Modules
const Yml = require('yaml');
const Fs = require('fs');
const Commander = require('commander');
const Version = require('./version');
const util = require('fallout-utility');

const commands = new Commander.Command;
    
    commands
            .option('-t, --testmode')
            .option('-D, --discord-token <token>');
    commands.parse();

// Export
module.exports = function() {
    this.location = null;
    this.config = {};

    this.parse = function() {
        if(!this.location || this.location == null) throw new Error('No config file path provided');
        let config = Fs.readFileSync(this.location, 'utf8');
            config = Yml.parse(config);

        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        
        if(config.token == 'TOKEN') config.token = null;

        this.config = config;
        return config;
    }
    this.prefill = function() {
        if(!this.config.token || this.config.token == null) this.config.token = util.ask('Bot Token >>> ');
    }
    this.testmode = function() {
        if(!commands.opts().testmode) return true;

        if(commands.opts().discordToken && commands.opts().discordToken != null) this.config.token = commands.opts().discordToken;
    }
}