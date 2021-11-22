const { Logger } = require('fallout-utility');
const log = new Logger('Safe Message');

module.exports = {
    /**
     * 
     * @param {Object} channel - The channel for message to send
     * @param {*} message - The message to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    async send (channel, message, verboseError = true) {
        try {
            return await channel.send(message).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} message - The message to send reply
     * @param {*} reply - The reply to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    async reply (message, reply, verboseError = true) {
        try {
            return await message.reply(reply).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} message - The message to delete
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async delete (message, verboseError = true) {
        try {
            return await message.delete().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} message - The message for reaction
     * @param {*} reaction - The reaction to send 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async react (message, reaction, verboseError = true) {
        try {
            return await message.react(reaction).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {*} message - The message to edit
     * @param {*} edit - Edited message content
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async edit (message, edit, verboseError = true) {
        try {
            return await message.edit(edit).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }
}