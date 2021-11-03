const MemberPermission = require('./memberPermissions');

/**
 * 
 * @param {string} command - command name or parsed script name
 * @param {Object} member - member object
 * @param {Object} config - config object
 * @returns {boolean} true if member has permission to use command
 */
module.exports = (command, member, config) => {
    if(config.permissions.adminOnlyCommands.find(key => { return key.toLowerCase() == command.toLowerCase(); }) && !MemberPermission.admin(member)) return false;
    if(config.permissions.moderatorOnlyCommands.find(key => { return key.toLowerCase() == command.toLowerCase(); }) && !MemberPermission.moderator(member)) return false;

    return true;
}