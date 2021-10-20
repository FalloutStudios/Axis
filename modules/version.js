const Version = require('../scripts/version');

module.exports = new create();

function create(){
    this.config = {};
    this.language = {};

    this.start = (config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        await message.reply(`**${client.user.username} v${Version}**\n Based on Axis bot v${Version}.\n https://github.com/FalloutStudios/Axis`);
        // Command executed
    }
}