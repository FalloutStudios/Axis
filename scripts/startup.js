const Logger = require('./logger');
module.exports = () => {
    let log = new Logger();
        log.defaultPrefix = 'Startup';

    log.log(' ▄▄▄      ▒██   ██▒ ██▓  ██████ ');
    log.log('▒████▄    ▒▒ █ █ ▒░▓██▒▒██    ▒ ');
    log.log('▒██  ▀█▄  ░░  █   ░▒██▒░ ▓██▄   ');
    log.log('░██▄▄▄▄██  ░ █ █ ▒ ░██░  ▒   ██▒');
    log.log(' ▓█   ▓██▒▒██▒ ▒██▒░██░▒██████▒▒');
    log.log(' ▒▒   ▓▒█░▒▒ ░ ░▓ ░░▓  ▒ ▒▓▒ ▒ ░');
    log.log('  ▒   ▒▒ ░░░   ░▒ ░ ▒ ░░ ░▒  ░ ░');
    log.log('  ░   ▒    ░    ░   ▒ ░░  ░  ░  ');
    log.log('      ░  ░ ░    ░   ░        ░  ');
                                
}