const AI = require("discord-chatbot");
const Util = require('fallout-utility');

module.exports = new create();

let chatbot = null;

function create(){
    this.config = {};
    this.language = {};
    this.command = {
        question: {
            required: true,
            values: ""
        }
    };

    this.start = (config, language, client) => {
        this.config = config;
        this.language = language;

        chatbot = new AI({name: client.user.username, gender: "male"});

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        // Command executed
        let sentence = Util.makeSentence(args).toString();

        let createMessage = await message.reply(action.get(this.language.thinking));

        chatbot.chat(sentence, message.author.username).then((response) => {
            response = Util.replaceAll(response, 'Udit', this.config.owner);
            response = Util.replaceAll(response, 'March 18, 2012', 'April 20, 2021');
            response = Util.replaceAll(response, 'Samik', message.author.username);

            createMessage.edit(response);
        }).catch(err => {
            console.error(err);
            createMessage.edit(action.get(this.language.error) + '\n```\n'+ err.message +'\n```')
        });
    }
}