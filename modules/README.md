# Script template

```js
// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    this.config = {};
    this.language = {};

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

    // This is required for both script and command. This will be called when bot is ready or reloaded
    this.start = (client, action, config, language) => {
        this.config = config;       // Set config
        this.language = language;   // Set language

        // Script is ready

        return true; // Return true when it's ready
    }

    // This is required for command module. You can delete this to make your script a non executable command
    this.execute = async (args, message, action, client) => {
        // Command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client
    }
}
```
