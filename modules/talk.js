const AI = require("smartestchatbot");
const Util = require('fallout-utility');

module.exports = new create();

let chatbot = new AI.Client();
let langs = require('../scripts/langs');
    langs = Object.keys(langs);

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

        if(args.length > 1 && typeof langs.filter(filter => filter == args[0]) !== 'undefined') {
            lang = langs.filter(filter => filter == args[0])[0];
            skip = 1;
        }

        // Command executed
        let sentence = Util.makeSentence(args, skip).toString();
        let createMessage = await message.reply(action.get(this.language.thinking));

        

        chatbot.chat({
            message: sentence, 
            name: client.user.username, 
            owner: action.get(this.config.owner), 
            user: message.author.id, 
            language: lang
        }).then((response) => {
            createMessage.edit(response);
        }).catch(err=> {
            console.error(err);
            createMessage.edit(action.get(this.language.error) + '\n```\n'+ err.message +'\n```')
        });
    }
}