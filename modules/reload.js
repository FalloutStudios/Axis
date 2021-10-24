const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = new create();

function create(){
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];

    this.start = (client, action, config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        // Command executed
        await action.messageReply(message, action.get(this.language.reload.requested));
        action.reload(message);
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("reload")
            .setDescription("Reload the bot"),
        async execute(interaction, client, action) {
            await interaction.reply(action.get(this.language.reload.requested));
            action.reload(null, interaction);
        }
    }
}