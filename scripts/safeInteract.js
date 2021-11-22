const { Logger } = require('fallout-utility');
const log = new Logger('Safe Interact');

module.exports = {
    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} reply - The reply to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async reply(interaction, reply, verboseError = true) {
        try {
            return await interaction.reply(reply).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {(string|Object)} options - Options for defered reply 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async deferReply(interaction, options, verboseError = true) {
        try {
            return await interaction.deferReply(options).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} edit - Edit sent reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async editReply(interaction, edit, verboseError = true) {
        try {
            return await interaction.editReply(edit).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} followUp - Send a follow up reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async followUp(interaction, followUp, verboseError = true) {
        try {
            return await interaction.followUp(followUp).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }
}