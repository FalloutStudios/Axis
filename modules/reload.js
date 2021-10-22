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
    this.execute = async (args, message, action, client) => {
        // Command executed
        await action.reply(message, action.get(this.language.reload.requested));
        action.reload(message);
    }
}