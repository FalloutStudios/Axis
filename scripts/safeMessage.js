const { Logger } = require('fallout-utility');
const log = new Logger('Safe Message');

module.exports = {
    /**
     * 
     * @param {Object} channel - The channel for message to send
     * @param {*} message - The message to send
     * @returns {Promise<void>} Promise message response
     */
    async send (channel, message) {
        try {
            return await channel.send(message).catch(err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },

    /**
     * 
     * @param {Object} message - The message to send reply
     * @param {*} reply - The reply to send
     * @returns {Promise<void>} Promise message response
     */
    async reply (message, reply) {
        try {
            return await message.reply(reply).catch(err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },

    /**
     * 
     * @param {Object} message - The message to delete
     * @returns {Promise<void>} Promise response
     */
    async delete (message) {
        try {
            return await message.delete().catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    },

    /**
     * 
     * @param {Object} message - The message for reaction
     * @param {*} reaction - The reaction to send 
     * @returns {Promise<void>} Promise response
     */
    async react (message, reaction) {
        try {
            return await message.react(reaction).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    },

    /**
     * 
     * @param {*} message - The message to edit
     * @param {*} edit - Edited message content
     * @returns {Promise<void>} Promise response
     */
    async edit (message, edit) {
        try {
            return await message.edit(edit).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
            return false;
        }
    }
}