const { SlashCommandBuilder } = require('@discordjs/builders');
const AI = require("../scripts/discord-chatbot/");
const safeMessage = require('../scripts/safeMessage');
const safeInteract = require('../scripts/safeIteract');
const Util = require('fallout-utility');

module.exports = new create();

let chatbot = null;

function create(){
    let config = {};
    let language = {};
    this.versions = ['1.1.0'];
    this.command = {
        question: {
            required: true,
            values: ""
        }
    };

    // Create the chatbot
    this.start = (client, action, conf, lang) => {
        config = conf;
        language = lang;

        chatbot = new AI({name: client.user.username, gender: "male"});

        return true;
    }
    this.execute = async (args, message, client, action) => {
        let sentence = Util.makeSentence(args).toString().trim();
        if(sentence.length == 0) { await message.reply(action.get(language.empty)); return; }

        message.channel.sendTyping();
        let reply = await ask(sentence, message.author.username, config.owner);

        if(reply) safeMessage.reply(message, reply);
    }

    this.slash = {
        command: new SlashCommandBuilder()
            .setName("ask")
            .setDescription(`Ask me something`)
            .addStringOption(option => option.setName('question')
                .setDescription("Question")
                .setRequired(true)
            ),
        async execute(interaction, client, action) {
            await safeInteract.deferReply(interaction);
            const response = await ask(interaction.options.getString('question'), interaction.member.username, config.owner);

            await safeInteract.editReply(interaction,response);
        }
    }
}

async function ask(message, username, owner){
    // Get udit api response
    try {
        let answer = false;
        await chatbot.chat(message, username).then((response) => {
            response = Util.replaceAll(response, 'Udit', owner);

            answer = response;
        }).catch((err) => {
            console.error(err);
        });

        return answer;
    } catch (err) {
        console.error(err);
    }

    return false;
}