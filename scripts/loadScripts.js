const Path = require('path');
const Util = require('fallout-utility');
const DataTypeValidator = require('./dataTypeValidator');
const Fs = require('fs');

/**
* @param {string} location - The path to scripts
* @param {Object} Client - Discord client
* @returns {Object} - returns an object with the loaded scripts
*/
module.exports = async (Client, location) => {
    const log = Client.AxisUtility.get().logger;
    const config = Client.AxisUtility.get().config;
    const scripts = {};
    const commands = { MessageCommands: [], InteractionCommands: [] };

    // Load all scripts
    if(!Fs.existsSync(location)) Fs.mkdirSync(location, { recursive: true });

    const modulesList = Fs.readdirSync(location).filter(file => file.endsWith('.js') && !file.startsWith('_'));

    // Start scripts
    for (const file of modulesList) {
        const path = Path.join(location , file);
        const importModule = require(path);
        const name = Util.replaceAll(Path.parse(file).name, ' ', '_').toLowerCase().split('.').shift();

        try {
            // Name of the script
            if(!name || !DataTypeValidator.moduleName(name)) throw new Error('Invalid Script Name: Name must be all lowercase without a special characters');

            // Check supported version
            if (!importModule.versions.find(version => version == config.version)) { throw new Error(`${file} (${name}) does not support Axis version ${config.version}`); }

            // Import script
            scripts[name] = importModule;
            scripts[name]['_information'] = {file: file, name: name, path: path};
            if (!await Promise.resolve(scripts[name].onStart(Client))) { throw new Error(`Couldn't start script ${file}. Returned false`); }

            // Register Commands
            loadCommands(scripts[name], commands);
            log.log(`Script ${name} has been successfully loaded!`, file);
        } catch (err) {
            log.error(`Coudln't load ${file}: ${err.message}`, file);
            log.error(err, file);
            delete scripts[name];
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
    if(!command.name || !DataTypeValidator.moduleName(command.name)) throw new Error(`Invalid command name: ${command.name}`);
    if(typeof command.execute !== 'function' || !DataTypeValidator.function(command.execute)) throw new Error(`Invalid command execute function: ${command.execute}`);
    
    commands.MessageCommands.push(command);
}
function parseInteractionCommand(command, commands) {
    if(!command.command || !Object.keys(command.command).length) throw new Error(`Invalid command 'command': ${command.command}`);
    if(typeof command.execute !== 'function' || !DataTypeValidator.function(command.execute)) throw new Error(`Invalid command execute function: ${command.execute}`);

    command.command = command.command.toJSON();
    commands.InteractionCommands.push(command);
}