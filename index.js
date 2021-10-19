/**    ###      ##     ##   ######     ######  
      ## ##      ##   ##      ##     ##    ## 
     ##   ##      ## ##       ##     ##       
    ##     ##      ###        ##      ######  
    #########     ## ##       ##           ## 
    ##     ##    ##   ##      ##     ##    ## 
    ##     ##   ##     ##   ######    ######  
**/

require('./scripts/startup')();

// Modules
const Util = require('fallout-utility');
const Config = require('./scripts/config');

const log = Util.logger;
const parseConfig = new Config();
parseConfig.location = './config/config.yml';
parseConfig.parse();
parseConfig.testmode();
parseConfig.prefill();