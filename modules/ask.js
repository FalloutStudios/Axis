const { SlashCommandBuilder } = require('@discordjs/builders');
const AI = require("../scripts/discord-chatbot/");
const safeMessage = require('../scripts/safeMessage');
const { makeSentence, replaceAll } = require('fallout-utility');

module.exports = new create();

let chatbot = null;

function create(){
    let config = {};
    let language = {};
    this.versions = ['1.1.0'];
    this.arguments = {
        question: {
            required: true,
            values: ""
        }
    };

    // Create the chatbot
    this.start = (client, action, conf, lang) => {
        config = conf;
        language = lang;

        chatbot = new AI({name: client.user.username, gender: "Male"});

        return true;
    }
    this.execute = async (args, message, client, action) => {
        let sentence = makeSentence(args).toString().trim();
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
            await interaction.deferReply();
            const response = await ask(interaction.options.getString('question'), interaction.member.username, config.owner);

            await interaction.editReply(response);
        }
    }
}

async function ask(message, username, owner){
    // Get udit api response
    try {
        let answer = false;
        await chatbot.chat(message, username).then((response) => {
            response = replaceAll(response, 'Udit', owner);

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