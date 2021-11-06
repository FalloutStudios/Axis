const { Logger } = require('fallout-utility');
const log = new Logger('Safe Interact');

module.exports = {
    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} reply - The reply to send
     * @returns {Promise<void>} Promise response
     */
    async reply(interaction, reply) {
        try {
            return await interaction.reply(reply).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {(string|Object)} options - Options for defered reply 
     * @returns {Promise<void>} Promise response
     */
    async deferReply(interaction, options) {
        try {
            return await interaction.deferReply(options).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} edit - Edit sent reply
     * @returns {Promise<void>} Promise response
     */
    async editReply(interaction, edit) {
        try {
            return await interaction.editReply(edit).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} followUp - Send a follow up reply
     * @returns {Promise<void>} Promise response
     */
    async followUp(interaction, followUp) {
        try {
            return await interaction.followUp(followUp).catch( err => { log.error(err); });
        } catch (err) {
            log.error(err);
        }
    }
}