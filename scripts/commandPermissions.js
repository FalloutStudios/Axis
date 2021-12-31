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
    if(findPermissions && Object.keys(findPermissions).length) {
        switch(findPermissions) {
            case !findPermissions?.permissions:
                throw new Error(`No permissions set for command: ${command}`);
            case (typeof findPermissions?.permissions !== 'object' && typeof findPermissions?.permissions !== 'string'):
                throw new Error(`Permissions for command: ${command} is not an object`);
        }
        
        return member && member.permissions.has(findPermissions.permissions) ? true : false;
    }

    return true;
}