const Version = require('../scripts/version');

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
    this.execute = async (args, message, client, action) => {
        // Command executed
        action.messageSend(message.channel, `**${client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
    }
}