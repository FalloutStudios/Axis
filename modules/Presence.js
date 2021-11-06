const { getRandomKey } = require('fallout-utility');

module.exports = new create();
function create(){
    this.versions = ['1.4.0'];

    this.start = async (client) => {
        const config = client.AxisUtility.getConfig();

        await client.user.setPresence({
            status: getRandomKey(config.presence.status),
            activities: [{
                name: getRandomKey(config.presence.activityName),
                type: getRandomKey(config.presence.type).toUpperCase()
            }]
        });

        return true;
    }
}