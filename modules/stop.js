const { Logger } = require('fallout-utility');
const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');

const log = new Logger('stop.js');

module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];

    this.start = (client, action, conf, lang) => {
        language = lang;
        return true;
    }
    this.execute = async (args, message, client, action) => {
        await safeMessage.reply(message, action.get(language.stop));
        await stop(client, action);
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("stop")
            .setDescription("Stop bot"),
        async execute(interaction, client, action) {
            await interaction.reply(action.get(language.stop));
            await stop(client, action);
        }
    }

    async function stop(client, action) {
        await client.destroy();
        log.warn('Stopping...');
        process.exit(0);
    }
}