module.exports = {
    async reply(interaction, reply) {
        try {
            return await interaction.reply(reply).catch( err => { log.error(err, 'Slash Reply'); });
        } catch (err) {
            log.error(err, 'Slash Reply');
        }
    },
    async deferReply(interaction, options) {
        try {
            return await interaction.deferReply(options).catch( err => { log.error(err, 'Slash DeferReply'); });
        } catch (err) {
            log.error(err, 'Slash DeferReply');
        }
    },
    async editReply(interaction, edit) {
        try {
            return await interaction.editReply(edit).catch( err => { log.error(err, 'Slash EditReply'); });
        } catch (err) {
            log.error(err, 'Slash EditReply');
        }
    },
    async followUp(interaction, followUp) {
        try {
            return await interaction.followUp(followUp).catch( err => { log.error(err, 'Slash FollowUp'); });
        } catch (err) {
            log.error(err, 'Slash FollowUp');
        }
    }
}