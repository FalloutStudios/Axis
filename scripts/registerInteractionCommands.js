const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Logger } = require('fallout-utility');
const Fs = require('fs');

const log = new Logger('Register Commands');

const deployFile = './deploy.txt';

module.exports = async (client, config, commands, guild = null, force = false,) => {
    // Deployment
    if(!config.slashCommands.enabled) return;
    if(Fs.existsSync(deployFile) && !force && !guild) {
        const deploy = Fs.readFileSync(deployFile).toString().trim();

        if(deploy == 'false') {
            return;
        }

        Fs.writeFileSync(deployFile, 'false');
    } else {
        Fs.writeFileSync(deployFile, 'false'); 
    }

    // Send
    const rest = new REST({ version: '9' }).setToken(config.token);
    (async () => {
        try {
            if(!guild){
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands },
                );
                log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a global scale.`);
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild),
                    { body: commands },
                );
                log.warn(`${ Object.keys(commands).length } application commands were successfully registered on a guild.`);
            }
        } catch (err) {
            log.error(err);
        }
    })();
}