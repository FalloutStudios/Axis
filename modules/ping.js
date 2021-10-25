const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = new create();

function create(){
    let language = {};
    this.versions = ['1.1.0'];

    this.start = (client, action, conf, lang) => {
        language = lang;

        return true;
    }
    this.execute = async (args, message, client, action) => {
        action.messageReply(message, action.get(language.ping));
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Ping!"),
        async execute(interaction, client, action){
            await action.interactionReply(interaction, `${action.get(language.ping)}`);
        }
    }
}