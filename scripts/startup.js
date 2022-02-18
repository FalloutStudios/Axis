const { loopString, limitText, Logger} = require('fallout-utility');
const Version = require('./version');

/**
 * 
 * @param {Logger} log 
 */
module.exports = (log) => {
    const logo = [' ▄▄▄      ▒██   ██▒ ██▓  ██████ ',
                  '▒████▄    ▒▒ █ █ ▒░▓██▒▒██    ▒ ',
                  '▒██  ▀█▄  ░░  █   ░▒██▒░ ▓██▄   ',
                  '░██▄▄▄▄██  ░ █ █ ▒ ░██░  ▒   ██▒',
                  ' ▓█   ▓██▒▒██▒ ▒██▒░██░▒██████▒▒',
                  ' ▒▒   ▓▒█░▒▒ ░ ░▓ ░░▓  ▒ ▒▓▒ ▒ ░',
                  '  ▒   ▒▒ ░░░   ░▒ ░ ▒ ░░ ░▒  ░ ░',
                  '  ░   ▒    ░    ░   ▒ ░░  ░  ░  ',
                  '      ░  ░ ░    ░   ░        ░  ']
    
    for (const line of logo) {
        log.log(limitText(line, process.stdout.columns - 16, ''));
    }
    
    const length = 32;
    const version = 'v' + Version;
    const bar = loopString((length / 2) - (version.length - 2), '=');

    log.warn(`${bar} ${version} ${bar}`);
}