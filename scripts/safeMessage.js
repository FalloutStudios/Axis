module.exports = function() {
    this.send = async (channel, message) => {
        try {
            return await channel.send(message).catch(err => { log.error(err, 'Message Send'); });
        } catch (err) {
            log.error(err, 'Message Send');
            return false;
        }
    }
    this.reply = async (message, reply) => {
        try {
            return await message.reply(reply).catch(err => { log.error(err, 'Message Reply'); });
        } catch (err) {
            log.error(err, 'Message Reply');
            return false;
        }
    }
    this.delete = async (message) => {
        try {
            return await message.delete().catch( err => { log.error(err, 'Message Delete'); });
        } catch (err) {
            log.error(err, 'Message Delete');
        }
    }
    this.react = async (message, reaction) => {
        try {
            return await message.react(reaction).catch( err => { log.error(err, 'Message Reaction'); });
        } catch (err) {
            log.error(err, 'Message React');
            return false;
        }
    }
    this.edit = async (message, edit) => {
        try {
            return await message.edit(edit).catch( err => { log.error(err, 'Message Edit'); });
        } catch (err) {
            log.error(err, 'Message Edit');
            return false;
        }
    }
}