module.exports = new create();

function create(){
    this.config = {};
    this.language = {};

    this.start = (config, language) => {
        this.config = config;
        this.language = language;
    }
    this.execute = async (args, message) => {
        await message.reply('Tanginamo');
        process.exit(0);
    }
}