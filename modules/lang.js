const { MessageEmbed } = require('discord.js');
const Util = require('fallout-utility');
module.exports = new create();

let langs = require('../scripts/langs');

function create(){
    this.config = {};
    this.language = {};
    this.command = {
        arg1: {
            required: false,
            values: ""
        },
        arg2: {
            required: true,
            values: ["value1", "value2"]
        }
    };

    this.start = (config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        // Command executed
        let sentence = !args && args == null ? '' : Util.makeSentence(args);

        console.log(args);

        let langsFetch = Object.keys(langs).filter((elmt) => {
            return elmt.toLowerCase().indexOf(sentence.toLowerCase()) !== -1
        });

        let embed = new MessageEmbed()
            .setAuthor(action.get(this.language.help.title), client.user.avatarURL)
            .setDescription(action.get(this.language.help.description))
            .setColor(this.config.embedColor)
            .setFooter(client.user.username)
            .setTimestamp();

        for (const lang of langsFetch) {
            let selected = langs[lang];
            embed.addField(selected['name'], `\`${lang}\` - ${selected['nativeName']}`, true);
        }

        await message.reply({ embeds: [embed] });
    }
}