const InteractionCommandBuilder = require('../scripts/interactionCommandBuilder');
const MessageCommandBuilder = require('../scripts/messageCommandBuilder');
const SafeMessage = require('../scripts/safeMessage');
const SafeInteract = require('../scripts/safeInteract');
const Util = require('fallout-utility');
const Version = require('../scripts/version');

const log = new Util.Logger('Axis');

async function getVersionMessage(args, message, Client) {
    await SafeMessage.reply(message, `**${Client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
}
async function getVersionInteraction(interaction, Client) {
    await SafeInteract.reply(interaction, `**${Client.user.username} v${Version}**\nBased on Axis bot v${Version}.\nhttps://github.com/FalloutStudios/Axis`);
}
function StopMessage(Client) {
    log.warn("Stopping...");
    return Util.getRandomKey(Client.AxisUtility.getLanguage().stop);
}

class Create {
    constructor() {
        this.versions = ['1.4.0'];
        this.commands = [
            // Version command
            new MessageCommandBuilder()
                .setName('version')
                .setDescription('Displays the current version of your Axis bot.')
                .setExecute((args, message, Client) => getVersionMessage(args, message, Client)),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('version')
                    .setDescription('Displays the current version of your Axis bot.')
                )
                .setExecute((interaction, Client) => getVersionInteraction(interaction, Client)),

            // Stop command
            new MessageCommandBuilder()
                .setName('stop')
                .setDescription('Stop the bot')
                .setExecute(async (args, message, Client) => { await SafeMessage.reply(message, StopMessage(Client)); process.exit(0); }),
            new InteractionCommandBuilder()
                .setCommand(SlashCommandBuilder => SlashCommandBuilder
                    .setName('stop')
                    .setDescription('Stop the bot')
                )
                .setExecute(async (interaction, Client) => { await SafeInteract.reply(interaction, StopMessage(Client)); process.exit(0); })
        ]
    }
    start = async (Client) => {
        log.log('Axis default command module has started!');
        log.log('Configuring bot presence...');

        const config = Client.AxisUtility.getConfig();
        await Client.user.setPresence({
            status: Util.getRandomKey(config.presence.status),
            activities: [{
                name: Util.getRandomKey(config.presence.activityName),
                type: Util.getRandomKey(config.presence.type).toUpperCase()
            }]
        });

        return true;
    }
}

module.exports = new Create();