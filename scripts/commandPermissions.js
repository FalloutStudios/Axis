const MemberPermission = require('./memberPermissions');

module.exports = (command, member, list) => {
    if(!list.enable) return true;
    if(has(list.adminOnlyCommands, command) && !MemberPermission.admin(member)) return false;
    if(has(list.moderatorOnlyCommands, command) && !MemberPermission.moderator(member)) return false;

    return true;
}

function has(obj, key) {
    return typeof obj.find(name => name.toLowerCase() === key.toLowerCase()) !== 'undefined';
}