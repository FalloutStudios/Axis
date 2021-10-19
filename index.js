/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##    ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  
**/

// Modules
const Startup = require('./scripts/startup')();
const Logger = require('./scripts/logger');
const Config = require('./scripts/config');

const log = new Logger();
const parseConfig = new Config();
parseConfig.location = './config/config.yml';
parseConfig.parse();
parseConfig.testmode();
parseConfig.prefill();

// Functions
console.log(parseConfig.config);