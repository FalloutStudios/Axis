const MemberPermission = require('./memberPermissions');

module.exports = (command, member, config) => {
    if(config.permissions.adminOnlyCommands.find(key => { return key.toLowerCase() == command.toLowerCase(); }) && !MemberPermission.admin(member)) return false;
    if(config.permissions.moderatorOnlyCommands.find(key => { return key.toLowerCase() == command.toLowerCase(); }) && !MemberPermission.moderator(member)) return false;

    return true;
}