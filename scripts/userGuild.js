module.exports = class Create {
    constructor(Client) {
        this.Client = Client;
    }

    getMember(guildId, userId) {
        return this.getGuild(guildId)?.members.cache.get(userId);
    }

    getUser(userId) {
        return this.Client.users.cache.get(userId);
    }

    getOwner(guildId) {
        const userId = this.getGuild(guildId)?.ownerId;
        return userId ? this.getMember(guildId, userId) : null;
    }

    getGuild(guildId) {
        return this.Client.guilds.cache.get(guildId);
    }
}