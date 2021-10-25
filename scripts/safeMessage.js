const { logger } = require('fallout-utility');
const log = logger;

module.exports = {
    async send (channel, message) {
        try {
            return await channel.send(message).catch(err => { log.error(err, 'Message Send'); });
        } catch (err) {
            log.error(err, 'Message Send');
            return false;
        }
    },
    async reply (message, reply) {
        try {
            return await message.reply(reply).catch(err => { log.error(err, 'Message Reply'); });
        } catch (err) {
            log.error(err, 'Message Reply');
            return false;
        }
    },
    async delete (message) {
        try {
            return await message.delete().catch( err => { log.error(err, 'Message Delete'); });
        } catch (err) {
            log.error(err, 'Message Delete');
        }
    },
    async react (message, reaction) {
        try {
            return await message.react(reaction).catch( err => { log.error(err, 'Message Reaction'); });
        } catch (err) {
            log.error(err, 'Message React');
            return false;
        }
    },
    async edit (message, edit) {
        try {
            return await message.edit(edit).catch( err => { log.error(err, 'Message Edit'); });
        } catch (err) {
            log.error(err, 'Message Edit');
            return false;
        }
    }
}