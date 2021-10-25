module.exports = function() {
    this.reply = async (interaction, reply) => {
        try {
            return await interaction.reply(reply).catch( err => { log.error(err, 'Slash Reply'); });
        } catch (err) {
            log.error(err, 'Slash Reply');
        }
    }
    this.deferReply = async (interaction, options) => {
        try {
            return await interaction.deferReply(options).catch( err => { log.error(err, 'Slash DeferReply'); });
        } catch (err) {
            log.error(err, 'Slash DeferReply');
        }
    }
    this.editReply = async (interaction, edit) => {
        try {
            return await interaction.editReply(edit).catch( err => { log.error(err, 'Slash EditReply'); });
        } catch (err) {
            log.error(err, 'Slash EditReply');
        }
    }
    this.followUp = async (interaction, followUp) => {
        try {
            return await interaction.followUp(followUp).catch( err => { log.error(err, 'Slash FollowUp'); });
        } catch (err) {
            log.error(err, 'Slash FollowUp');
        }
    }
}