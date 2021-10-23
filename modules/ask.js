const AI = require("../scripts/discord-chatbot/");
const Util = require('fallout-utility');

module.exports = new create();

let chatbot = null;

function create(){
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];
    this.command = {
        question: {
            required: true,
            values: ""
        }
    };

    // Create the chatbot
    this.start = (client, action, config, language) => {
        this.config = config;
        this.language = language;

        chatbot = new AI({name: client.user.username, gender: "male"});
        return true;
    }
    this.execute = async (args, message, action, client) => {
        let sentence = Util.makeSentence(args).toString().trim();
        if(sentence.length == 0) { await message.reply(action.get(this.language.empty)); return; }

        message.channel.sendTyping();

        // Get udit api response
        try {
            chatbot.chat(sentence, message.author.id).then((response) => {
                response = Util.replaceAll(response, 'Udit', this.config.owner);

                action.reply(message, response);
            }).catch((err) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}