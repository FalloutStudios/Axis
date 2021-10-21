module.exports = new create();

function create(){
    this.config = {};
    this.language = {};
    this.command = {
        username: {
            required: true
        },
        reason: {
            required: false
        }
    };

    this.start = (config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        // Command executed
    }
}