const { Permissions } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Object} member - Guild member object
     * @param {Object} permissions - Discord permissions flags
     * @returns {boolean} Returns if member is administrator
     */
    admin(member, permissions = Permissions.FLAGS.ADMINISTRATOR) {
        if(member && member.permissions.has(permissions)) return true;
        return false;
    },

    /**
     * @param {Object} member - Guild member object
     * @param {Object} permissions - Discord permissions flags
     * @returns {boolean} Returns if member is moderator
    */
    moderator(member, permissions = [Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.KICK_MEMBERS]) {
        if(member && member.permissions.has(permissions)) return true;
        return false;
    },

    /**
     * @param {String} channelId - Channel ID
     * @param {Object} blacklistChannels - list of channels to blacklist
     * @param {string} blacklistChannels.enabled - Returns if blacklist is enabled
     * @param {boolean} blacklistChannels.convertToWhitelist - Convert blacklist to whitelist
     * @param {Object[]} blacklistChannels.channels - List of channels to blacklist or whitelist
     * @returns {boolean} Returns if channel is accessible
    */
    isIgnoredChannel(channelId, blacklistChannels) {
        if(blacklistChannels.enabled && (
            !blacklistChannels.convertToWhitelist && blacklistChannels.channels.includes(channelId.toString())
            || 
            blacklistChannels.enabled && blacklistChannels.convertToWhitelist && !blacklistChannels.channels.includes(channelId.toString())
        )) { return true; }

        return false;
    }
}