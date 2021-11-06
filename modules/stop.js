const { Logger, getRandomKey } = require('fallout-utility');
const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');

const log = new Logger('stop.js');

module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.4.0'];

    this.start = (client, conf, lang) => {
        language = lang;
        return true;
    }
    this.execute = async (args, message, client) => {
        await safeMessage.reply(message, getRandomKey(language.stop));
        await stop(client);
    }

    async function stop(client) {
        await client.destroy();
        log.warn('Stopping...');
        process.exit(0);
    }
}