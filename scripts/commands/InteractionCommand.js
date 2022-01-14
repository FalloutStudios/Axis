module.exports = class {
    /**
     * 
     * @param {string} command - command name
     * @param {Object} message - message object
     * @returns {Promise<void>}
     */
     async messageCommand(command, message) {
        const cmd = this.get().commands.MessageCommands.find(property => property.name === command);
        const args = Util.getCommand(message.content.trim(), this.get().config.commandPrefix).args;

        // If the command exists
        if(!cmd) return false;

        // Check permission
        if(!CommandPermission(command, message.member, this.get().config.permissions.messageCommands)) {
            return SafeMessage.reply(message, Util.getRandomKey(this.get().language.noPerms));
        }

        // Execute
        return this.executeMessageCommand(command, message, args).catch(async err => log.error(err, `${this.get().config.commandPrefix}${command}`));
    }

    /**
     * 
     * @param {Object} interaction - Interaction object
     * @returns {Promise<void>}
     */
    async interactionCommand(interaction) {
        // Execute commands
        const cmd = interaction.isCommand() ? commands.InteractionCommands.find(property => property.name === interaction.commandName) : null;
        
        // If command exists
        if(!cmd) return false;

        // Check configurations
        if(MemberPermission.isIgnoredChannel(interaction.channelId, this.get().config.blacklistChannels) || !cmd.allowExecViaDm && !interaction?.member) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.get().language.notAvailable), ephemeral: true });
        }

        // Check permission
        if(!CommandPermission(interaction.commandName, interaction.member, this.get().config.permissions.interactionCommands)) { 
            return SafeInteract.reply(interaction, { content: Util.getRandomKey(this.get().language.noPerms), ephemeral: true });
        }

        return this.executeInteractionCommand(interaction.commandName, interaction).catch(err => log.error(err, `/${interaction.commandName}`));
    }
}