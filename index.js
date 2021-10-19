/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##    ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  
**/

// Modules
const Util = require('fallout-utility');
const Startup = require('./scripts/startup')();
const Config = require('./scripts/config');

const log = Util.logger;
const parseConfig = new Config();
parseConfig.location = './config/config.yml';
parseConfig.parse();
parseConfig.testmode();
parseConfig.prefill();

// Functions
log.log(parseConfig.config);