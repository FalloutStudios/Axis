module.exports = class UserGuild {
    /**
     * 
     * @param {Object} Client - Discord Client
     */
    constructor(Client) {
        this.Client = Client;
    }

    /**
     * 
     * @param {string} guildId - guild id 
     * @param {string} userId - user id
     * @returns {Object} member object
     */
    getMember(guildId, userId) {
        return this.getGuild(guildId)?.members.cache.get(userId);
    }

    /**
     * 
     * @param {string} userId - user id
     * @returns {Object} user object
     */
    getUser(userId) {
        return this.Client.users.cache.get(userId);
    }

    /**
     * 
     * @param {string} guildId - guild id
     * @returns {Object} owner member object
     */
    getOwner(guildId) {
        const userId = this.getGuild(guildId)?.ownerId;
        return userId ? this.getMember(guildId, userId) : null;
    }

    /**
     * 
     * @param {string} guildId - guild id
     * @returns {Object} guild object
     */
    getGuild(guildId) {
        return this.Client.guilds.cache.get(guildId);
    }
}