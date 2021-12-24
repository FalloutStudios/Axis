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
    if(has(list.adminOnlyCommands, command) && !MemberPermission.admin(member, list?.permissions.admin ? list.permissions.admin : null)) return false;
    if(has(list.moderatorOnlyCommands, command) && !MemberPermission.moderator(member, list?.permissions.moderator ? list.permissions.moderator : null)) return false;

    return true;
}

function has(obj, key) {
    return typeof obj.find(name => name.toLowerCase() === key.toLowerCase()) !== 'undefined';
}