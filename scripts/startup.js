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

    let length = 32;
    let version = 'v' + Version;
    let bar = loopString((length / 2) - (version.length - 2),'=');
    log.warn(bar + ' ' + version + ' ' + bar);
}