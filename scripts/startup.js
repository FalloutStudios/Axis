// Modules
const { logger, loopString } = require('fallout-utility');
const Version = require('./version');


let log = logger;
    log.defaultPrefix = 'Startup';

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

    let length = '                                '.length;
    let version = 'v' + Version;
    let bar = loopString((length / 2) - (version.length - 2),'=');
    log.warn(bar + ' ' + version + ' ' + bar);
}