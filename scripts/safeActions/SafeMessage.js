const { Logger } = require('fallout-utility');
const {
    Message,
    ReplyMessageOptions,
    MessageOptions,
    AwaitMessageComponentOptions,
    AwaitReactionsOptions,
    MessageComponentCollectorOptions,
    ReactionCollectorOptions,
    MessageEditOptions,
    EmojiIdentifierResolvable,
    StartThreadOptions,
    BaseGuildTextChannel,
    User
} = require('discord.js');
let log = new Logger('SafeMessage');

module.exports = {
    /**
     * 
     * @param {Object[]} logger - Logger instance
     */
    setLogger(logger) {
        log = logger;
    },

    // Message methods

    /**
     * 
     * @param {Message} message - Message object 
     * @param {AwaitMessageComponentOptions} [options={}] - Options to pass to the internal collector
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async awaitMessageComponent(message, options = {}, verboseError = true) {
        try {
            return await message.awaitMessageComponent(options).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch(err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object 
     * @param {AwaitReactionsOptions} [options={}] - Options to pass to the internal collector
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async awaitReactions(message, options = {}, verboseError = true) {
        try {
            return await message.awaitReactions(options).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object 
     * @param {MessageComponentCollectorOptions} [options={}] - Options to send to the collector
     * @param {boolean} [verboseError=true] - Whether to send full error message
     */
    createMessageComponentCollector(message, options = {}, verboseError = true) {
        try {
            return message.createMessageComponentCollector(options);
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object
     * @param {ReactionCollectorOptions} [options={}] - Options to send to the collector
     * @param {boolean} [verboseError=true] - Whether to send full error message 
     */
    createReactionCollector(message, options = {}, verboseError = true) {
        try {
            return message.createReactionCollector(options);
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object
     * @param {boolean} [verboseError= true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async crosspost(message, verboseError = true) {
        try {
            return await message.crosspost().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to delete
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async delete(message, verboseError = true) {
        try {
            return await message.delete().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to edit
     * @param {MessageEditOptions} edit - Edited message content
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async edit(message, edit, verboseError = true) {
        try {
            return await message.edit(edit).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message to compare with message2
     * @param {Message} message2 - Message to compare with message
     * @param {*} rawMessage - Raw data passed through the WebSocket about this message
     * @param {boolean} [verboseError=true] - Whether to send full error message
     */
    equals(message, message2, rawMessage, verboseError = true) {
        try {
            return message.equals(message2, rawMessage);
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object
     * @param {boolean} [force=true] - Whether to skip the cache check and request the API
     * @param {boolean} [verboseError=true] - Whether to send full error message 
     * @returns {Promise<void>}
     */
    async fetch(message, force = true, verboseError = true) {
        try {
            return await message.fetch(force).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to fetch reference
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async fetchReference(message, verboseError = true) {
        try {
            return await message.fetchReference().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to fetch webhooks for
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async fetchWebhook(message, verboseError = true) {
        try {
            return await message.fetchWebhook().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - Message object
     * @param {boolean} [verboseError=true] - Whether to send full error message
     */
    inGuild(message, verboseError = true) {
        try {
            return message.inGuild();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to pin
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async pin(message, verboseError = true) {
        try {
            return await message.pin().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to add reactions
     * @param {EmojiIdentifierResolvable} reaction - The reaction to send 
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async react(message, reaction, verboseError = true) {
        try {
            return await message.react(reaction).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to remove attachments
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async removeAttachments(message, verboseError = true) {
        try {
            return await message.removeAttachments().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to remove all reactions
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response
     */
    async reactionRemoveAll(message, verboseError = true) {
        try {
            return await message.reactions.removeAll().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to delete a reaction
     * @param {string} reactionId - The reactionId (emoji id) to delete
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise response 
     */
    async reactionRemove(message, reactionId, verboseError = true) {
        try{
            return await message.reactions.cache.get(reactionId)?.remove().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to send reply
     * @param {ReplyMessageOptions|string} reply - The reply to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    async reply(message, reply, verboseError = true) {
        try {
            return await message.reply(reply).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to remove all reactions
     * @param {string} setCustomId - The custom id to resolve against
     * @param {boolean} [verboseError=true] - Whether to send full error message
     */
    resolveComponent(message, setCustomId, verboseError = true) {
        try {
            return message.resolveComponent(setCustomId);
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to start New Tread
     * @param {StartThreadOptions} options - Options for starting a thread on this message
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async startThread(message, options, verboseError = true) {
        try {
            return await message.startThread(options).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to start New Tread
     * @param {boolean} suppress - If the embeds should be suppressed or not
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async suppressEmbeds(message, suppress = true, verboseError = true) {
        try {
            return await message.suppressEmbeds(suppress).catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to convert to a string
     * @param {boolean} [verboseError=true] - Whether to send full error message
     */
    toString(message, verboseError = true) {
        try {
            return message.toString();
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    /**
     * 
     * @param {Message} message - The message to unpin
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>}
     */
    async unpin(message, verboseError = true) {
        try {
            return await message.unpin().catch( err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },

    // sendMessage

    /**
     * 
     * @param {BaseGuildTextChannel|User} destination - The message destination (channel, user, ...)
     * @param {MessageOptions|string} message - The message to send
     * @param {boolean} [verboseError=true] - Whether to send full error message
     * @returns {Promise<void>} Promise message response
     */
    async send(destination, message, verboseError = true) {
        try {
            return await destination.send(message).catch(err => { log.error(verboseError ? err : err?.message); });
        } catch (err) {
            log.error(verboseError ? err : err?.message);
            return false;
        }
    },
}