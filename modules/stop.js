const { logger } = require('fallout-utility');
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
        // Command executed
        if(!action.admin(message)) { message.reply(action.get(this.language.noPerms)); return; }

        await message.reply(action.get(this.language.stop));
        logger.warn('Stopping...', 'stop.js');
        process.exit(0);
    }
}