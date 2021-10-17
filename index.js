//    ###      ##     ##   ####    ######  
//   ## ##      ##   ##     ##    ##    ## 
//  ##   ##      ## ##      ##    ##       
// ##     ##      ###       ##     ######  
// #########     ## ##      ##          ## 
// ##     ##    ##   ##     ##    ##    ## 
// ##     ##   ##     ##   ####    ######  

// Modules
const Startup = require('./scripts/startup')();
const Logger = require('./scripts/logger');
const Config = require('./scripts/config');

const parseConfig = new Config();
parseConfig.location = './config/config.yml';
parseConfig.parse();
parseConfig.prefill({})