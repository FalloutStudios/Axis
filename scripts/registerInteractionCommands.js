const Fs = require('fs');
const MakeConfig = require('./makeConfig');
const Discord = require('discord.js');
const Config = require('./config/Config');
const InteractionCommandBuilder = require('./builders/InteractionCommandBuilder');

const deployFile = './deploy.txt';

/**
 * 
 * @param {Discord.Client} Client - Discord Client with AxisUtility
 * @param {Config.config} config - Parsed config object
 * @param {InteractionCommandBuilder[]} commands - List of slash commands
 * @param {boolean} force - Force register commands without check deploy file
 * @returns {Promise<void>}
 */
module.exports = async (Client, commands, force = false) => {
    // Deployment
    const log = Client.AxisUtility.logger;
    const config = Client.AxisUtility.config;
    const deployOption = config.guildId || force ? false : Fs.existsSync(deployFile);

    if (deployOption) {
        const deploy = Fs.readFileSync(deployFile).toString().trim();

        if(deploy == 'false') return log.warn('Deployment file found, skipping register commands');
    }

    commands = fetchCommands(commands);

    // Register
    try {
        if(!config.guildId){
            await Client.application.commands.set(commands);
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
                await Client.application.commands.set(commands, guildId);
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