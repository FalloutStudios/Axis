// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];

    // This will be executed on bot ready
    this.start = (client, action, config, language) => {
        this.config = config;   // Set config
        this.language = language; // Set language

        // Command ready
        return true; // Return true if it's ready
    }

    // This will be executed when the command is called
    this.execute = async (args, message, client, action) => {
        // Command executed

        // args: list of separate words
        // message: raw discord.js message
        // action: actions from main file
        // client: discord client
        action.messageReply(message, action.get(this.language.ping));
    }
}