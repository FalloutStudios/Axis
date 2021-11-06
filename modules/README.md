# Script template

```js
// Require this if you want to add slash command
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create the command
function Create(){
    // This is required to specify the supported version of bot
    this.versions = ['1.3.1'];

    // If this is a command module, you can optionally add args description for help.js
    this.arguments = {
        arg1: {
            required: false,                // Is this required
            values: []                      // Values of this argument 
        },
        arg2: {
            required: true,                 // Is this required
            values: ["value1", "value2"]    // Values of this argument
        }
    };


    // This is required for both script and command. This is called on bot ready
    this.start = async (client, conf, lang) => {
        return true;    // Return true when it's ready
    }

    // This is required for command module. You can delete this to make your script a non executable command
    this.execute = async (args, message, client) => {
        // Message command executed

        // args: list of separate words
        // message: raw discord.js message
        // client: discord client

        await message.reply(`test`);
    }

    // Add slash commands. This is optional
    this.slash = {
        // command: is required for slash command module. (Command name will be replaced with parsed file name of this module)
        command: new SlashCommandBuilder()
            .setDescription('This is a test command'),

        // This will be called when the slash command is executed.
        async execute (interaction, client) {
            // Slash command executed

            // interaction: interaction data from discord.js
            // client: discord client
            
            await interaction.reply(`test`);
        }
    }
}

// Export the module
module.exports = new Create();
```
