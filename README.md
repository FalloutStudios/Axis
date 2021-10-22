# Axis 🗡️

![GitHub top language](https://img.shields.io/github/languages/top/FalloutStudios/Axis)
![GitHub repo size](https://img.shields.io/github/repo-size/FalloutStudios/Axis)
![Lines of code](https://img.shields.io/tokei/lines/github/FalloutStudios/Axis)

Axis bot is named after the Our World's server clan named `Axis` *The reincarnation of Fallout clan*

## Custom script

This is an example command script file `modules/example.js`

```js
// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    this.config = {};
    this.language = {};

    // Command description
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

    // This will be executed on bot ready
    this.start = (config, language) => {
        this.config = config;   // Set config
        this.language = language; // Set language

        // Command ready
        return true; // Return true if it's ready
    }

    // This will be executed when the command is called
    this.execute = async (args, message, action, client) => {
        // Command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client
    }
}
```
