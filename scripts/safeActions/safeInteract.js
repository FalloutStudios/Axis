module.exports = (log) => {

    if(!log) {
        const { Logger } = require('fallout-utility');
        log = new Logger('safeInteract');
    }

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} reply - The reply to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.reply = async (interaction, reply, verboseError = true) => {
        try {
            return await interaction.reply(reply).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {(string|Object)} options - Options for defered reply 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.deferReply = async (interaction, options, verboseError = true) => {
        try {
            return await interaction.deferReply(options).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} edit - Edit sent reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.editReply = async (interaction, edit, verboseError = true) => {
        try {
            return await interaction.editReply(edit).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {*} followUp - Send a follow up reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    this.followUp = async (interaction, followUp, verboseError = true) => {
        try {
            return await interaction.followUp(followUp).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    }
}