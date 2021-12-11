module.exports = {

    /**
     * 
     * @param {Object} logger - Logger instance
     * @returns 
     */
    SafeMessage(logger) { return require('./safeMessage.js')(logger) },

    /**
     * 
     * @param {Object} logger - Logger instance
     * @returns 
     */
    SafeInteract(logger) { return require('./safeInteract.js')(logger) }
}