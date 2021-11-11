const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Logger } = require('fallout-utility');
const Fs = require('fs');
const MakeConfig = require('./makeConfig');

const log = new Logger('Register Commands');

const deployFile = './deploy.txt';

/**
 * 
 * @param {Object} client - Discord client instance
 * @param {Object} config - Parsed config object
 * @param {Object} commands - List of slash commands
 * @param {string} guild - register commands to a guild
 * @param {boolean} force - Force register commands without check deploy file
 * @returns {Promise<void>}
 */
module.exports = async (client, commands, guild = null, force = false,) => {
    // Deployment
    const config = client.AxisUtility.getConfig();

    if(!config.permissions.interactionCommands.registerSlashCommands) return;
    if(Fs.existsSync(deployFile) && !force && !guild) {
        const deploy = Fs.readFileSync(deployFile).toString().trim();

        if(deploy == 'false') {
            return;
        }
    }

    commands = fetchCommands(commands);

    // Send
    const rest = new REST({ version: '9' }).setToken(config.token);
    try {
        if(!Object.keys(commands).length) { log.warn('No interaction commands found.'); return; }
        if(!guild){
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a global scale.`);
        } else {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild),
                { body: commands }
            );
            log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a guild.`);
        }

        MakeConfig(deployFile, 'false');
    } catch (err) {
        log.error(err);
    }
}

function fetchCommands(list) {
    const commands = [];
    list.forEach(command => commands.push(command.command));

    return commands;
}