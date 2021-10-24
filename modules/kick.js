const Util = require('fallout-utility');
const { MessageEmbed } = require('discord.js');
module.exports = new create();

function create(){
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];
    this.command = {
        username: {
            required: true
        },
        reason: {
            required: false
        }
    };

    this.start = (client, action, config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, client, action) => {
        // Command executed
        if(!args.length) { action.messageReply(message, action.get(this.language.empty)); return; }
        if(!message.mentions.members.first() || message.mentions.members.first() == null) { action.messageReply(message, action.get(this.language.needPing)); return; }

        const target = message.mentions.members.first();
        let reason = Util.makeSentence(args, 1).toString().trim();

        if(reason.length == 0) reason = action.get(this.language.kicked.defaultReason);
        if(target.user.id == message.author.id) { action.messageReply(message, action.get(this.language.noPerms)); return; }
        target.kick(reason).then((member) => {
            reason = Util.replaceAll(reason, '%username%', member.user.username);
            reason = Util.replaceAll(reason, '%author%', message.author.username);

            let embed = new MessageEmbed()
                .setTitle(action.get(this.language.kicked.title))
                .setDescription(reason)
                .setTimestamp();
            action.messageReply(message, { embeds: [embed]});
        }).catch((err) => {
            console.error(err);
            action.messageReply(message, action.get(this.language.error) + '\n```\n'+ err.message +'\n```');
        });
    }
}