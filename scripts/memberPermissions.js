module.exports = {
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
            !blacklistChannels.convertToWhitelist && blacklistChannels.channels.find(chnl => chnl == channelId)
            || 
            blacklistChannels.enabled && blacklistChannels.convertToWhitelist && !blacklistChannels.channels.find(chnl => chnl == channelId)
        )) { return true; }

        return false;
    }
}