const Util = require('fallout-utility');
const Fs = require('fs');
const Path = require('path');
const { MessageEmbed } = require('discord.js');

const log = Util.logger;
    log.defaultPrefix = 'help.js';

module.exports = new create();

let modulesList = Fs.readdirSync(__dirname + '/').filter(file => file.endsWith('.js'));
let commands = {};
for (const file of modulesList) {
    let name = Path.parse(file).name;

    if(name == 'help') continue;

    let importModule = require(`./${file}`);
    
    try {
        name = Util.replaceAll(name, ' ', '_');
        commands[name] = importModule.command;

        if(typeof commands[name] !== 'undefined' && Object.keys(commands[name]).length > 0) { log.warn('Help ready for command: ' + name, file); } else { commands[name] = null; }
    } catch (e) {
        console.log(e);
    }
}

function create(){
    this.config = {};
    this.language = {};

    this.start = (config, language) => {
        this.config = config;
        this.language = language;

        // Command ready
        return true;
    }
    this.execute = async (args, message, action, client) => {
        // Command executed

        let filter = Util.makeSentence(args);
        
        let embed = new MessageEmbed()
            .setAuthor(action.get(this.language.help.title), client.user.avatarURL)
            .setDescription(action.get(this.language.help.description))
            .setColor(this.config.embedColor)
            .setFooter(client.user.username)
            .setTimestamp();

        if(filter && filter.length > 0) commands = commands.indexOf(filter);

        for (const value in commands) {
            embed.addField(value, '```'+ this.config.commandPrefix + createString(commands[value], value) +'```', false);
        }

        message.channel.send({ embeds: [embed] }).catch(err => { log.error(err) });
        return true;
    }
}

function createString(object = {}, commandName = '%command%'){
    let command = commandName;
    let args = "";

    for(let name in object){
        const types = {
            required: "<%arg%:required%values%>",
            optional: "[%arg%:optional%values%]"
        }

        let arg = object[name].required ? types['required'] : types['optional'];
            arg = Util.replaceAll(arg, '%arg%', name);

        let values = "";
            if(object[name].values && object[name].values.length > 0){
                let endLength = object[name].values.length;

                let increment = 0;

                values += ' | ';

                for (const value of object[name].values) {
                    increment++;

                    values += value;
                    if(increment < endLength) values += ", ";
                }
            }

        args += ' ' + Util.replaceAll(arg, '%values%', values);
    }

    args = args.trim();

    if(args == '')return command;
    return command + " " + args;
}