const Version = require('../scripts/version');
const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');
const safeInteract = require('../scripts/safeInteract');

module.exports = new create();

function create(){
    this.versions = ['1.1.0'];

    this.start = (client, action, conf, lang) => {
        return true;
    }
    this.execute = async (args, message, client, action) => {
        // Command executed
        await safeMessage.send(message.channel, `**${client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("version")
            .setDescription("Current bot version"),
        async execute(interaction, client, action) {
            await safeInteract.reply(interaction, `**${client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
        }
    }
}