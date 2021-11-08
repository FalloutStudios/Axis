const Path = require('path');
const Util = require('fallout-utility');
const Fs = require('fs');

const log = new Util.Logger('loadScripts');

   /**
    * @param {string} location - The path to scripts
    * @param {Object} Client - Discord client
    * @returns {Object} - returns an object with the loaded scripts
    */
module.exports = async (Client, location) => {
    const config = Client.AxisUtility.getConfig();
    const scripts = {};
    const commands = { MessageCommands: [], InteractionCommands: [] };

    const modulesList = Fs.readdirSync(location).filter(file => { return file.endsWith('.js') && !file.startsWith('_'); });

    for (const file of modulesList) {
        const path = Path.join(location , file);
        const importModule = require(path);

        try {
            // Name of the script
            const name = Util.replaceAll(Path.parse(file).name, ' ', '_').toLowerCase().split('.').shift();
            if(!name || !validateString(name)) throw new Error('Invalid Script Name: Name must be all lowercase with a special characters');

            // Check supported version
            if (!importModule.versions || importModule.versions && !importModule.versions.find(version => version == config.version)) { throw new Error(`${file} (${name}) does not support Axis version ${config.version}`); }

            // Import script
            scripts[name] = importModule;
            scripts[name]['_information'] = {file: file, name: name, path: path};
            if (!await scripts[name].start(Client)) { delete scripts[name]; throw new Error(`Couldn't start script ${file}`); }

            // Register Commands
            loadCommands(scripts[name], commands);
            log.log(`Script ${name} has been successfully loaded!`, file);
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

function loadCommands(script, commands) {
    if(!script.commands || !script.commands.length) return;

    for (const command of script.commands) {
        if(typeof commands[command] !== 'undefined') throw new Error(`Because the command name already exists, it was not possible to add command ${command} from ${script._information.file}.'`);

        if(command.type === 'MessageCommand') {
            parseMessageCommand(command, commands);
        } else if(command.type === 'InteractionCommand') {
            parseInteractionCommand(command, commands);
        } else {
            throw new Error(`Invalid command type ${command.type}`);
        }
    }
}
function parseMessageCommand(command, commands) {
    if(!command.name || !validateString(command.name)) throw new Error(`Invalid command name: ${command.name}`);
    if(!command.execute || !validateFunction(command.execute)) throw new Error(`Invalid command execute function: ${command.execute}`);
    
    commands.MessageCommands.push(command);
}
function parseInteractionCommand(command, commands) {
    if(!command.command || !Object.keys(command.command).length) throw new Error(`Invalid command 'command': ${command.command}`);
    if(!command.execute || !validateFunction(command.execute)) throw new Error(`Invalid command execute function: ${command.execute}`);

    commands.InteractionCommands.push(command);
}

function validateFunction(value) {
    return typeof value === 'function';
}

function validateString(value) {
    return typeof value === 'string' && value.match(/^[a-z]+$/);
}