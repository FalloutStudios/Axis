const Fs = require('fs');
const Yml = require('yaml');
const Util = require('fallout-utility');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = new create();

function create(){
    let config = {};
    let language = {};

    this.versions = ['1.1.0'];
    this.command = {
        count: {
            required: false,
            values: []
        },
        message: {
            required: true,
            values: []
        }
    };

    // Spam command default config
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
    this.start = (client, action, conf, lang) => {
        config = conf;
        language = lang;

        // Generate config for spam command
        if(!Fs.existsSync('./config/' + spamConfigFile)) { 
            Fs.writeFileSync('./config/' + spamConfigFile, Yml.stringify(spamConfig)); 
        } else {
            spamConfig = Yml.parse(Fs.readFileSync('./config/' + spamConfigFile, 'utf-8'));
        }
        return true;
    }

    this.execute = async (args, message, client, action) => {

        let msg = Util.makeSentence(args).toString().trim();
        let count = spamConfig.defaultSpamCount;

        if(args.length > 1 && Util.isNumber(parseInt(args[0]))){
            count = parseInt(args[0]);
            msg = Util.makeSentence(args, 1).toString().trim();
        }

        // Validate message
        if(msg == '') { action.messageReply(message, action.get(language.empty)); return; }
        if(!spamConfig.convertDisabledChannelsToWhitelist && spamConfig.disabledChannels.includes(message.channelId.toString()) || spamConfig.convertDisabledChannelsToWhitelist && !spamConfig.disabledChannels.includes(message.channelId.toString())) { action.messageReply(message, action.get(language.noPerms)); return; }
        if(count > spamConfig.spamLimit) { action.messageReply(message, action.get(language.tooLarge)); return; }
        if(!spamConfig.allowSpamPings && message.mentions.users.size > 0 && message.mentions.roles.size > 0 && message.mentions.everyone || spamConfig.allowSpamPings) { action.messageReply(message, action.get(this.language.noPerms)); return; }

        // Loop message
        for (let i = 0; i < count; i++){
            await action.messageSend(message.channel, spamConfig.spamMessagePrefix + msg);
        }
    }

    this.slash = {
        command: new SlashCommandBuilder()
            .setName('name')
            .setDescription('Spam this channel')
            .addStringOption(text => text.setName("message")
                .setDescription("Message to spam")
                .setRequired(true)
            )
            .addIntegerOption(num => num.setName("count")
                .setDescription("Number of messages to spam")
                .setRequired(false)
            ),
        async execute(interaction, client, action) {
            let msg = interaction.options.getString('message');
            let count = spamConfig.defaultSpamCount;

            if(interaction.options.getInteger('count')) count = interaction.options.getInteger('count');

            for (let i = 0; i < count; i++){
                await action.messageSend(interaction.channel, spamConfig.spamMessagePrefix + msg);
            }
        }
    }
}