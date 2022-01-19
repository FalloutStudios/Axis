const { Logger } = require('fallout-utility');
let log = new Logger('SafeInteract');

module.exports = {
    /**
     * 
     * @param {Object[]} logger - Logger instance
     */
    setLogger(logger) {
        log = logger;
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
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async deleteReply(interaction, verboseError = true) {
        try {
            return await interaction.deleteReply(options).catch( err => { log.error(verboseError ? err : err?.message); });
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
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async fetchReply(interaction, verboseError = true) {
        try {
            return await interaction.fetchReply().catch( err => { log.error(verboseError ? err : err?.message); });
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
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    inCachedGuild(interaction, verboseError = true) {
        try {
            return interaction.inCachedGuild();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    inGuild(interaction, verboseError = true) {
        try {
            return interaction.inGuild();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    inRawGuild(interaction, verboseError = true) {
        try {
            return interaction.inRawGuild();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isApplicationCommand(interaction, verboseError = true) {
        try {
            return interaction.isApplicationCommand();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isAutocomplete(interaction, verboseError = true) {
        try {
            return interaction.isAutocomplete();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isButton(interaction, verboseError = true) {
        try {
            return interaction.isButton();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isCommand(interaction, verboseError = true) {
        try {
            return interaction.isCommand();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isContextMenu(interaction, verboseError = true) {
        try{
            return interaction.isContextMenu();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isMessageComponent(interaction, verboseError = true) {
        try{
            return interaction.isMessageComponent();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isMessageContextMenu(interaction, verboseError = true) {
        try{
            return interaction.isMessageContextMenu();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isSelectMenu(interaction, verboseError = true) {
        try{
            return interaction.isSelectMenu();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Object} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean} response
     */
    isUserContextMenu(interaction, verboseError = true) {
        try{
            return interaction.isUserContextMenu();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

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
    }
}