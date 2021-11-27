// Modules
const { Logger, loopString } = require('fallout-utility');
const Version = require('./version');


let log = new Logger('Startup');

// Export
module.exports = () => {
    log.log(' ▄▄▄      ▒██   ██▒ ██▓  ██████ ');
    log.log('▒████▄    ▒▒ █ █ ▒░▓██▒▒██    ▒ ');
    log.log('▒██  ▀█▄  ░░  █   ░▒██▒░ ▓██▄   ');
    log.log('░██▄▄▄▄██  ░ █ █ ▒ ░██░  ▒   ██▒');
    log.log(' ▓█   ▓██▒▒██▒ ▒██▒░██░▒██████▒▒');
    log.log(' ▒▒   ▓▒█░▒▒ ░ ░▓ ░░▓  ▒ ▒▓▒ ▒ ░');
    log.log('  ▒   ▒▒ ░░░   ░▒ ░ ▒ ░░ ░▒  ░ ░');
    log.log('  ░   ▒    ░    ░   ▒ ░░  ░  ░  ');
    log.log('      ░  ░ ░    ░   ░        ░  ');

    const length = 32;
    const version = 'v' + Version;
    const bar = loopString((length / 2) - (version.length - 2), '=');

    log.warn(`${bar} ${version} ${bar}`);
}