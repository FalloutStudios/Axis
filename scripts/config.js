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
    }

    parse() {
        if(!this.location || this.location == null) throw new Error('No config file path provided');
        let config = Fs.readFileSync(this.location, 'utf8');
            config = Yml.parse(config);
        
        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        if(config.token == 'TOKEN') config.token = null;

        return config;
    }

    /**
     * @param {Object} config parsed config data
     */
    prefill(config) {
        if(!config.token || config.token == null) config.token = ask('Bot Token >>> ');

        return config;
    }

    /**
     * @param {Object} config parsed config data
     */
    testmode(config) {
        if(commands.opts().testmode) config.token = process.env['discordtoken'];

        return config;
    }
}