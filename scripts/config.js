const Yml = require('yaml');
const Fs = require('fs');
const Prompt = require('prompt-sync')();
const Commander = require('commander');
const Version = require('./version');

module.exports = function() {
    this.location = null;
    this.config = {};

    this.parse = function() {
        if(!this.location || this.location == null) throw new Error('No config file path provided');
        let config = Fs.readFileSync(this.location, 'utf8');
            config = Yml.parse(config);

        if(config.version != Version) throw new Error('Config version isn\'t compatible. Version: ' + config.version + '; Supported: ' + Version);
        
        this.config = config;
        return config;
    }
    this.prefill = function() {
        
    }
    this.testmode = function() {

    }
}