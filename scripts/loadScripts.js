const Path = require('path');
const Util = require('fallout-utility');
const Fs = require('fs');
const { Collection } = require('discord.js');

const log = new Util.Logger('loadScripts');

   /**
    * @param {string} location - The path to scripts
    * @param {Object} Client - Discord client
    * @returns {Object} - returns an object with the loaded scripts
    */
module.exports = async (Client, location) => {
    const config = Client.AxisUtility.getConfig();
    const scripts = {};
    const commands = [];

    const modulesList = Fs.readdirSync(location).filter(file => { return file.endsWith('.js') && !file.startsWith('_'); });

    for (const file of modulesList) {
        const path = Path.join(location , file);
        const importModule = require(path);

        try {
            // Name of the script
            const name = Util.replaceAll(Path.parse(file).name, ' ', '_').toLowerCase().split('.').shift();
            if(!name) continue;

            // Check supported version
            if (!importModule.versions || importModule.versions && !importModule.versions.find(version => version == config.version)) { log.error(`${file} (${name}) does not support Axis version ${config.version}`, file); continue; }

            // Import script
            scripts[name] = importModule;
            if (!await scripts[name].start(Client)) throw new Error(`Couldn't start script ${file}`);
            log.log(`Script ${name} ready!`, file);

            // Slash commands
            if (typeof scripts[name]['slash'] === 'undefined') continue;

            scripts[name]['slash']['command']['name'] = name;
            commands.push(scripts[name]['slash']['command'].toJSON());
        } catch (err) {
            log.error(`Coudln't load ${file}: ${err.message}`, file);
            log.error(err, file);
        }
    }

    return {
        scripts: scripts,
        commands: commands
    };
}