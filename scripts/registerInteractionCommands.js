const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Fs = require('fs');
const MakeConfig = require('./makeConfig');

const deployFile = './deploy.txt';

/**
 * 
 * @param {Object} Client - Discord Client instance
 * @param {Object} config - Parsed config object
 * @param {Object} commands - List of slash commands
 * @param {string} guild - register commands to a guild
 * @param {boolean} force - Force register commands without check deploy file
 * @returns {Promise<void>}
 */
module.exports = async (Client, commands, force = false) => {
    // Deployment
    const log = Client.AxisUtility.logger;
    const config = Client.AxisUtility.config;

    if(!config.permissions.interactionCommands.registerSlashCommands) return log.warn('RegisterSlashCommands is disabled');
    if(Fs.existsSync(deployFile) && !force && !config.guildId) {
        const deploy = Fs.readFileSync(deployFile).toString().trim();

        if(deploy == 'false') return log.warn('Deployment file found, skipping register commands');
    }

    commands = fetchCommands(commands);

    // Send
    const rest = new REST({ version: '9' }).setToken(config.token);
    try {
        if(!config.guildId){
            await rest.put(
                Routes.applicationCommands(Client.user.id),
                { body: commands }
            );
            log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a global scale.`);
        } else {
            let guild = config.guildId;
            switch(typeof guild) {
                case 'string':
                    guild = [guild];
                    break;
                case 'object': break;
                default:
                    throw new Error('Invalid guild id');
            }

            for(const guildId of guild) {
                if(typeof guildId != 'string') throw new TypeError('Guild ID must be a string');
                await rest.put(
                    Routes.applicationGuildCommands(Client.user.id, guildId),
                    { body: commands }
                );
                log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a guild ${guildId}.`);
            }
        }

        MakeConfig(deployFile, 'false', true);
    } catch (err) {
        log.error(err);
    }
}

function fetchCommands(list) {
    const commands = [];
    list.forEach(command => commands.push(command.command));

    return commands;
}