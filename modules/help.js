const { makeSentence, replaceAll, Logger } = require('fallout-utility');
const Fs = require('fs');
const Path = require('path');
const { MessageEmbed } = require('discord.js');
const { Pagination } = require("discordjs-button-embed-pagination");
const { SlashCommandBuilder } = require('@discordjs/builders');

const log = new Logger('help.js');

module.exports = new create();

// list available modules
let modulesList = Fs.readdirSync(__dirname + '/').filter(file => file.endsWith('.js'));
let commands = {};

function create(){
    this.config = {};
    this.language = {};
    this.versions = ['1.1.0'];
    this.command = {
        search: {
            required: false
        }
    };

    this.start = (client, action, config, language) => {
        this.config = config;
        this.language = language;

        // List all commands
        for (const file of modulesList) {
            let name = Path.parse(file).name;
            let importModule = require(`./${file}`);
            
            // Check if it's a valid command module
            try {
                name = replaceAll(name, ' ', '_');
                if(typeof importModule.execute === 'undefined') continue;

                commands[name] = importModule.command;
        
                if(typeof commands[name] === 'undefined' || Object.keys(commands[name]).length <= 0){ commands[name] = null; }
            } catch (err) {
                console.error(err);
            }
        }
        return true; // Always return true
    }
    this.execute = async (args, message, client, action) => {
        // Command executed
        let filter = makeSentence(args);
        let visibleCommands = Object.keys(commands);
        const config = this.config;

        // Filter commands
        visibleCommands = visibleCommands.filter((elmt) => {
            // Check permissions
            if(!confPerms(config, action, message.member, elmt)) return false;

            // Filter
            if(filter && filter.length > 0) { return elmt.toLowerCase().indexOf(filter.toLowerCase()) !== -1; }
            return true;
        });
        
        // Create embeds
        let embeds = [];
        let limit = 5;
        let increment = -1;
        let current = 0;
        
        // Separate embeds
        for (const value of visibleCommands) {
            // Increment page
            if(ifNewPage(increment, limit)) { current++; increment = 0; } else { increment++; }

            // Create embed
            if(!embeds[current]) {
                embeds.push(new MessageEmbed()
                    .setAuthor(action.get(this.language.help.title), client.user.displayAvatarURL())
                    .setDescription(action.get(this.language.help.description))
                    .setColor(config.embedColor)
                    .setTimestamp());
            }

            // Add command
            embeds[current].addField(value, '```'+ config.commandPrefix + createString(commands[value], value) +'```', false);
        }

        // Send response
        try {
            new Pagination(message.channel, embeds, "Page", 20000).paginate();
        } catch (err) {
            console.error(err);
        }
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Show help for commands"),
        async execute(interaction, client, action) {
            // Soon
        }
    }
}

// Functions
function createString(object = {}, commandName = '%command%'){
    let command = commandName;
    let args = "";

    for(let name in object){
        const types = {
            required: "<%arg%%values%>",
            optional: "[%arg%%values%]"
        }

        let arg = object[name].required ? types['required'] : types['optional'];
            arg = replaceAll(arg, '%arg%', name);

        let values = "";
            if(object[name].values && object[name].values.length > 0){
                let endLength = object[name].values.length;

                let increment = 0;

                values += ': ';

                for (const value of object[name].values) {
                    increment++;

                    values += value;
                    if(increment < endLength) values += ", ";
                }
            }

        args += ' ' + replaceAll(arg, '%values%', values);
    }

    args = args.trim();

    if(args == '')return command;
    return command + " " + args;
}
function confPerms(config, action, member, elmt){
    if(config.moderatorOnlyCommands.find(key => key.toLowerCase() == elmt) && permsLevel(action, member) < 1) return false;
    if(config.adminOnlyCommands.find(key => key.toLowerCase() == elmt) && permsLevel(action, member) < 2) return false;

    return true;
}
function permsLevel(action, member) {
    if(action.moderator(member)) {
        return 1;
    } else if(action.admin(member)) {
        return 2;
    }
    return 0;
}
function ifNewPage(i, intLimit){
    return i >= (intLimit - 1);
}