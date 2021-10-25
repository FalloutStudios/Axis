const { SlashCommandBuilder } = require('@discordjs/builders');
const safeMessage = require('../scripts/safeMessage');
const safeInteract = require('../scripts/safeIteract');
module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];

    this.start = (client, action, conf, lang) => {
        language = lang;

        return true;
    }
    this.execute = async (args, message, client, action) => {
        await safeMessage.reply(message, action.get(language.ping));
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Ping!"),
        async execute(interaction, client, action){
            await safeInteract.reply(interaction, `${action.get(language.ping)}`);
        }
    }
}