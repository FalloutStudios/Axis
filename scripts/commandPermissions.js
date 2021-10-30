const MemberPermission = require('./memberPermissions');

module.exports = (command, member, config) => {
    if(config.permissions.adminOnlyCommands.hasOwnProperty(command.toLowerCase()) && MemberPermission.admin(member)) return true;
    if(config.permissions.moderatorOnlyCommands.hasOwnProperty(command.toLowerCase()) && MemberPermission.moderator(member)) return true;

    return false;
}