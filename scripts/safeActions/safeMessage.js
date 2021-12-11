module.exports = (log) => {
    
    if(!log) {
        const { Logger } = require('fallout-utility');
        log = new Logger('SafeMessage');
    }

    /**
     * 
     * @param {Object} channel - The channel for message to send
     * @param {*} message - The message to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    this.send = (channel, message, verboseError = true) => {
        try {
            return await channel.send(message).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} message - The message to send reply
     * @param {*} reply - The reply to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    this.reply = (message, reply, verboseError = true) => {
        try {
            return await message.reply(reply).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} message - The message to delete
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.delete = (message, verboseError = true) => {
        try {
            return await message.delete().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} message - The message for reaction
     * @param {*} reaction - The reaction to send 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.react = (message, reaction, verboseError = true) => {
        try {
            return await message.react(reaction).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {*} message - The message to edit
     * @param {*} edit - Edited message content
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.edit = (message, edit, verboseError = true) => {
        try {
            return await message.edit(edit).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }
}