// Modules
const Yml = require('yaml');
const Fs = require('fs');
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
        let config = Fs.readFileSync(this.location, 'utf8');
            config = Yml.parse(config);
        
        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        if(config.token == 'TOKEN') config.token = null;

        this.config = config;
        return this;
    }

    /**
     * @returns {Object} returns modified config
     */
    prefill() {
        if(!this.config.token || this.config.token == null) this.config.token = ask('Bot Token >>> ');

        return this;
    }

    /**
     * @returns {Object} returns modified config
     */
    testmode() {
        if(commands.opts().testmode) this.config.token = process.env['discordtoken'];

        return this;
    }

    /**
     * @returns {Object} returns parsed config
     */
    getConfig() {
        return this.config;
    }
}