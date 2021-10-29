const { Logger } = require('fallout-utility');
const log = new Logger('Safe Message');

module.exports = {
    async send (channel, message) {
        try {
            return await channel.send(message).catch(err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },
    async reply (message, reply) {
        try {
            return await message.reply(reply).catch(err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },
    async delete (message) {
        try {
            return await message.delete().catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    },
    async react (message, reaction) {
        try {
            return await message.react(reaction).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },
    async edit (message, edit) {
        try {
            return await message.edit(edit).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    }
}