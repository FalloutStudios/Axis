const MemberPermission = require('./memberPermissions');

/**
 * 
 * @param {string} command - The command name
 * @param {Object} member - Discord member object
 * @param {Object[]} list - List of commands with permission levels
 * @param {boolean} list.enable - Whether the permission level is enabled
 * @param {Object} list.adminOnlyCommands - List of commands that are only available to admins
 * @param {Object} list.moderatorOnlyCommands - List of commands that are only available to moderators
 * @returns 
 */
module.exports = (command, member, list) => {
    if(!list.enabled) return true;
    
    const findPermissions = list.commands.find(x => x.command === command);
    if(findPermissions?.lenght) {
        if(member && findPermissions?.permissions && member.permissions.has(findPermissions.permissions)) return true;
        return false;
    }

    return true;
}