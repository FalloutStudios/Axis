// Export the module
module.exports = new create();

// Create the command
function create(){
    // Command and language
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];

    // This is required for both script and command. This will be called when bot is ready or reloaded
    this.start = (client, action, config, language) => {
        // Script is ready
        client.user.setPresence({
            status: config.presence.status,
            activities: [{
                name: config.presence.activityName,
                type: config.presence.type.toUpperCase()
            }]
        });

        return true; // Return true when it's ready
    }
}