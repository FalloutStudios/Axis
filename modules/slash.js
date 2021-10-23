const { SlashCommandBuilder } = require('@discordjs/builders');
// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    var config = {};
    var language = {};

    // This is required to specify the supported version of bot
    this.versions = ['1.1.0'];

    // If this is a command, you can optionally add description
    this.command = {
        arg1: {
            required: false, // Is this required
            values: [] // Values of this argument 
        },
        arg2: {
            required: true, // Is this required
            values: ["value1", "value2"] // Values of this argument
        }
    };

    // This is required for both script and command.
    this.start = (client, action, conf, lang) => {
        // Set config and language
        config = conf;
        language = lang;

        return true; // Return true when it's ready
    }

    // This is required for command module. You can delete this to make your script a non executable command
    this.execute = async (args, message, action, client) => {
        // Message command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client
    }

    // Add slash commands
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("slash")
            .setDescription('This command is deprecated'),
        execute: function (interaction, client, action) {
            interaction.reply('///');
        }
    }
}