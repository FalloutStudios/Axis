const Version = require('../scripts/version');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = new create();

function create(){
    let config = {};
    let language = {};

    this.versions = ['1.1.0'];

    this.start = (client, action, conf, lang) => {
        config = conf;
        language = lang;

        // Command ready
        return true;
    }
    this.execute = async (args, message, client, action) => {
        // Command executed
        action.messageSend(message.channel, `**${client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("version")
            .setDescription("Current bot version"),
        async execute(interaction, client, action) {
            await action.interactionReply(interaction, `**${client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
        }
    }
}