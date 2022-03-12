// Modules
const Fs = require('fs');
const Yml = require('yaml');
const MakeConfig = require('../makeConfig');
const Commander = require('commander');
const Version = require('../version');
const { input, replaceAll } = require('fallout-utility');

const commands = new Commander.Command;
    commands.option('-t, --testmode', 'Use "discordtoken" environment as a token');
    commands.option('-L, --logging <value>', 'Toggle log file (True/False)', true);
    commands.option('-l, --logFilePath <logFilePath>', 'Log file path', './logs/latest.log');
    commands.parse();

module.exports = class Config {
    /**
     * @param {string} location - config file location
     */
    constructor(location) {
        this.location = location;
        this.config = null;
    }

    /**
     * @returns {Config}
     */ 
    parse() {
        if(!this.location || this.location == null) throw new Error('No config file path provided');

        const config = Yml.parse(MakeConfig(this.location, Fs.existsSync(this.location) ? Fs.readFileSync(this.location, 'utf8') : Config.generateConfig()));

        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        this.config = config;

        return this
    }

    /**
     * @returns {Config}
     */ 
    commands() {
        let logging;
        if(typeof commands.opts().logging === 'string' && (commands.opts().logging.toLowerCase() == 'false' || commands.opts().logging.toLowerCase() == 'true')) {
            logging = { status: commands.opts().logging.toLowerCase() == 'true' ? true : false };
        }

        this.config.token = commands.opts().testmode ? process.env['discordtoken'] : this.config.token;
        this.config.logging.enabled = logging ? logging.status : this.config.logging.enabled;
        this.config.logging.logFilePath = commands.opts().logFilePath ? commands.opts().logFilePath : this.config.logging.logFilePath;

        return this;
    }

    /**
     * @returns {Config}
     */ 
    prefill() {
        this.config.token = this.config.token === 'TOKEN' ? null : this.config.token;
        this.config.token = Config.envToken(this.config.token) || this.config.token;
        this.config.token = this.config.token || input({ text: 'Bot Token >>> ', echo: '*', repeat: true });

        return this;
    }

    /**
     * @returns {Config.config}
     */ 
    getConfig() {
        return this.config;
    }

    /**
     * 
     * @returns {string} returns parsed config in yaml format
     */
    static generateConfig() {
        const config = replaceAll(Fs.readFileSync('./scripts/config/src/config.yml', 'utf8'), '${Version}', Version);
        const token = input({ text: 'Bot Token >>> ', echo: '*', repeat: true });

        return replaceAll(config, 'TOKEN', token);
    }

    /**
     * @returns {string}
     */
    static envToken(token) {
        if (!token) return false;

        const env = token.split(":");
        if (env.length === 0 || env[0].toLowerCase() !== 'env') return false;

        return process.env[env[1]];
    }
}