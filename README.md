# Axis 🗡️

<img align="right" src="https://i.imgur.com/yRsHfHi.png" height="140" width="140">

![GitHub top language](https://img.shields.io/github/languages/top/FalloutStudios/Axis)
![GitHub repo size](https://img.shields.io/github/repo-size/FalloutStudios/Axis)
![Lines of code](https://img.shields.io/tokei/lines/github/FalloutStudios/Axis)
![Node.js CI](https://github.com/FalloutStudios/Axis/actions/workflows/node.js.yml/badge.svg?branch=main)

Axis bot is named after the Our World's server clan named `Axis` *The reincarnation of Fallout clan*

## Installation

To run or self-host, the following prerequisites must be installed.

+ Node js `version >=16.6.0`

Run `npm install` to install all dependencies then `node index.js` to run the bot.

## Custom script

This is an example command script file.

```js
// Require this if you want to add slash command
const { SlashCommandBuilder } = require('@discordjs/builders');

// Create the command
function Create(){
    // This is required to specify the supported version of bot
    this.versions = ['1.1.0'];

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
    this.start = async (client, action, conf, lang) => {
        return true;    // Return true when it's ready
    }

    // This is required for command module. You can delete this to make your script a non executable command
    this.execute = async (args, message, client, action) => {
        // Message command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client

        await message.reply(`test`);
    }

    // Add slash commands. This is optional
    this.slash = {
        // command: is required for slash command module.
        command: new SlashCommandBuilder()
            .setName("command")
            .setDescription('This is a test command'),

        // This will be called when the slash command is executed.
        async execute (interaction, client, action) {
            // Slash command executed

            // interaction: interaction data from discord.js
            // action: actions from main file
            // client: discord client
            
            await interaction.reply(`test`);
        }
    }
}

// Export the module
module.exports = new Create();
```
