const AI = require("../scripts/discord-chatbot/");
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
        let sentence = Util.makeSentence(args).toString().trim();
        if(sentence.length == 0) { await message.reply(action.get(this.language.empty)); return; }

        message.channel.sendTyping()

        try {
            chatbot.chat(sentence, message.author.id).then(async (response) => {
                response = Util.replaceAll(response, 'Udit', this.config.owner);
                response = Util.replaceAll(response, 'March 18, 2012', 'April 20, 2021');
                response = Util.replaceAll(response, 'Samik', message.author.username);

                await message.reply(response);
            }).catch(async (err) => {
                console.error(err);
                await message.reply(action.get(this.language.error) + '\n```\n'+ err.message +'\n```');
            });
        } catch (err) {
            console.error(err);
            await message.reply(action.get(this.language.error) + '\n```\n'+ err.message +'\n```')
        }
    }
}