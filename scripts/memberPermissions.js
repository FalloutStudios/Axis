const { Permissions } = require('discord.js');

module.exports = {
    admin(member) {
        if(member && member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return true;
        return false;
    },
    moderator(member) {
        if(member && member.permissions.has([Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.KICK_MEMBERS])) return true;
        return false;
    },
    isIgnoredChannel(channelId, config) {
        if(
            config.blacklistChannels.enabled && !config.blacklistChannels.convertToWhitelist && config.blacklistChannels.channels.includes(channelId.toString())
            || 
            config.blacklistChannels.enabled && config.blacklistChannels.convertToWhitelist && !config.blacklistChannels.channels.includes(channelId.toString())
        ) { return true; }
        return false;
    }
}