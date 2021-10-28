const Fs = require('fs');
const Yml = require('yaml');
const { makeSentence, replaceAll, isNumber } = require('fallout-utility');
const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');

module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];
    this.arguments = {
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

        let msg = makeSentence(args).toString().trim();
        let count = spamConfig.defaultSpamCount;

        if(args.length > 1 && isNumber(parseInt(args[0]))){
            count = parseInt(args[0]);
            msg = makeSentence(args, 1).toString().trim();
        }

        // Validate message
        if(msg == '') { 
            await safeMessage.reply(message, action.get(language.empty));
            return; 
        }
        if(!spamConfig.convertDisabledChannelsToWhitelist && spamConfig.disabledChannels.includes(message.channelId.toString()) || spamConfig.convertDisabledChannelsToWhitelist && !spamConfig.disabledChannels.includes(message.channelId.toString())) { 
            await safeMessage.reply(message, action.get(language.noPerms));
            return;
        }
        if(count > spamConfig.spamLimit) { 
            await safeMessage.reply(message, action.get(language.tooLarge));
            return;
        }
        if(!spamConfig.allowSpamPings && message.mentions.users.size > 0 && message.mentions.roles.size > 0 && message.mentions.everyone || spamConfig.allowSpamPings) {
            await safeMessage.reply(message, action.get(this.language.noPerms));
            return;
        }

        // Loop message
        for (let i = 0; i < count; i++){
            await safeMessage.send(message.channel, spamConfig.spamMessagePrefix + msg);
        }
    }

    this.slash = {
        command: new SlashCommandBuilder()
            .setName('spam')
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
            

            if(count > spamConfig.spamLimit) { 
                await interaction.reply({ content: action.get(language.tooLarge), ephemeral: true});
                return;
            }
            if(!spamConfig.allowSpamPings) {
                msg = replaceAll(msg, '<', '<\\');
                msg = replaceAll(msg, '>', '\>');
            }
            if(interaction.options.getInteger('count')) count = interaction.options.getInteger('count');

            await interaction.deferReply({ ephemeral: true });
            for (let i = 0; i < count; i++){
                await safeMessage.send(interaction.channel, spamConfig.spamMessagePrefix + msg);
            }
            await interaction.editReply({ content: action.get(language.success), ephemeral: true });
        }
    }
}