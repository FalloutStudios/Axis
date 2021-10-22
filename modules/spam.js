const Fs = require('fs');
const Yml = require('yaml');
const Util = require('fallout-utility');
// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    this.config = {};
    this.language = {};

    // Command description
    this.command = {
        arg1: {
            required: false, // Is this required
            values: [] // Values of this argument 
        },
        arg2: {
            required: true, // Is this required
            values: ["value1", "value2"] // Values of this argument
        }
    };

    const spamConfigFile = 'spam.yml';
    let spamConfig = {
        spamMessagePrefix: '`spam:` ',
        spamLimit: 100,
        defaultSpamCount: 10,
        allowSpamPings: false,
        disabledChannels: [],
        convertDisabledChannelsToWhitelist: false
    };

    // This will be executed on bot ready
    this.start = (client, action, config, language) => {
        this.config = config;   // Set config
        this.language = language; // Set language

        // Command ready
        if(!Fs.existsSync('./config/' + spamConfigFile)) { 
            Fs.writeFileSync('./config/' + spamConfigFile, Yml.stringify(spamConfig)); 
        } else {
            spamConfig = Yml.parse(Fs.readFileSync('./config/' + spamConfigFile, 'utf-8'));
        }
        return true; // Return true if it's ready
    }

    // This will be executed when the command is called
    this.execute = async (args, message, action, client) => {
        // Command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client

        let msg = Util.makeSentence(args).toString().trim();
        let count = spamConfig.defaultSpamCount;

        if(args.length > 1 && Util.isNumber(parseInt(args[0]))){
            count = parseInt(args[0]);
            msg = Util.makeSentence(args, 1).toString().trim();
        }

        if(msg == '') { action.reply(message, action.get(this.language.empty)); return; }

        if(!spamConfig.convertDisabledChannelsToWhitelist && spamConfig.disabledChannels.includes(message.channelId.toString())
            ||
            spamConfig.convertDisabledChannelsToWhitelist && !spamConfig.disabledChannels.includes(message.channelId.toString())
        ) { action.reply(message, action.get(this.language.noPerms)); return; }

        if(count > spamConfig.spamLimit) { action.reply(message, action.get(this.language.tooLarge)); return; }

        if(!spamConfig.allowSpamPings && message.mentions.users.size > 0 && message.mentions.roles.size > 0 && message.mentions.everyone || spamConfig.allowSpamPings) { action.reply(message, action.get(this.language.noPerms)); return; }

        for (let i = 0; i < count; i++){
            await action.send(message.channel, spamConfig.spamMessagePrefix + msg);
        }
    }
}