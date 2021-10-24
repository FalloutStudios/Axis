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
        await action.messageReply(message, action.get(language.reload.requested));
        if(action.reload()) {
            action.messageReply(message, action.get(language.reload.success));
        } else {
            action.messageReply(action.get(language.error) + '\n```\nCheck console\n```');
        }
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("reload")
            .setDescription("Reload the bot"),
        async execute(interaction, client, action) {
            await interaction.deferReply();
            await interaction.editReply(action.get(language.reload.requested));

            if(await action.reload()) {
                await interaction.editReply(action.get(language.reload.success));
            } else {
                await interaction.editReply(action.get(language.error) + '\n```\nCheck console\n```');
            }
        }
    }
}