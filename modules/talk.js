const AI = require("smartestchatbot");
const Util = require('fallout-utility');

module.exports = new create();

let chatbot = new AI.Client();
let langs = require('../langs.json');

function create(){
    this.config = {};
    this.language = {};
    this.command = {
        languageCode: {
            required: false,
            values: ['en', 'de', '...']
        },
        question: {
            required: true,
            values: ""
        }
    };

    this.start = (config, language, client) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        let lang = 'auto';
        let skip = 0;

        if(args.length > 1 && typeof args[0] !== 'undefined') {
            langs.filter(filter => {
                return filter.key == args[0];
            });

            if(langs.length > 0) {
                lang = langs.filter(filter => filter.key == args[0])[0]['key'];
                skip = 1;
            }
        }

        // Command executed
        let sentence = Util.makeSentence(args, skip).toString().trim();
        if(sentence.length == 0) { await message.reply(action.get(this.language.empty)); return; }

        message.channel.sendTyping();

        try {
            chatbot.chat({
                message: sentence, 
                name: client.user.username, 
                owner: action.get(this.config.owner), 
                user: message.author.id, 
                language: lang
            }).then( async (response) => {
                action.reply(message, response);
            }).catch( async (err) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    }
}