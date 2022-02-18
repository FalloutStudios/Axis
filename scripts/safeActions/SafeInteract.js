const { Logger } = require('fallout-utility');
const {
    Interaction,
    InteractionDeferReplyOptions,
    InteractionReplyOptions,
    WebhookEditMessageOptions,
} = require('discord.js');
let log = new Logger('SafeInteract');

module.exports = {
    /**
     * 
     * @param {Logger} logger - Logger instance
     */
    setLogger(logger) {
        log = logger;
    },

    /**
     * 
     * @param {Interaction} interaction - The interaction object
     * @param {InteractionDeferReplyOptions} options - Options for defered reply 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
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
     * @param {Interaction} interaction - The interaction to delete reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async deleteReply(interaction, verboseError = true) {
        try {
            return await interaction.deleteReply().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Interaction} interaction - The interaction object
     * @param {WebhookEditMessageOptions|string} edit - Edit sent reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
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
     * @param {Interaction} interaction - The interaction to fetch reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
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
     * @param {Interaction} interaction - The interaction object
     * @param {InteractionReplyOptions|string} followUp - Send a follow up reply
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {boolean}
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
     * @param {Interaction} interaction - The interaction object
     * @param {InteractionReplyOptions|string} reply - The reply to send
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