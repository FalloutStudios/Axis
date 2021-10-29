const { makeSentence, replaceAll, Logger } = require('fallout-utility');
const Fs = require('fs');
const Path = require('path');
const { MessageEmbed, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const interactionPaginationEmbed = require('discordjs-button-pagination');
const { Pagination } = require("discordjs-button-embed-pagination");

const log = new Logger('help.js');
const interactionTimeout = 20000;
const argTypes = {
    required: "<%arg%%values%>",
    optional: "[%arg%%values%]"
}

module.exports = new create();

// list available modules
let modulesList = Fs.readdirSync(__dirname + '/').filter(file => file.endsWith('.js'));
let commands = {};
let slash = {};

// Create script
function create(){
    let config = {};
    let language = {};
    this.versions = ['1.1.0'];
    this.arguments = {
        search: {
            required: false
        }
    };

    // Load all commands
    this.start = (client, action, conf, lang) => {
        config = conf;
        language = lang;

        // List all commands
        for (const file of modulesList) {
            const importModule = require(`./${file}`);
            
            const name = replaceAll(Path.parse(file).name, ' ', '_').toLowerCase().split('.').shift();
            if(!name) continue;
            
            // Check if it's a valid command module
            try {
                if(typeof importModule.slash !== 'undefined' && typeof importModule.slash.command.toJSON() === 'object') { slash[importModule.slash.command.name] = addSlash(importModule.slash.command); }
                if(typeof importModule.execute !== 'undefined') { commands[name] = createString(importModule.arguments, name); }
            } catch (err) {
                console.error(err);
            }
        }

        return true;
    }
    this.execute = async (args, message, client, action) => {
        // Command executed
        let filter = makeSentence(args);
        let visibleCommands = Object.keys(commands);
            visibleCommands = filterVisibleCommands(visibleCommands, filter, message.member, action, config);
        
        // Create embeds
        let embeds = makePages(visibleCommands, commands, client, action, language, config.commandPrefix, config.embedColor);

        // Send response
        try {
            new Pagination(message.channel, embeds, "Page", interactionTimeout).paginate();
        } catch (err) {
            console.error(err);
        }
    }
    this.slash = {
        command: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Show help for commands")
            .addStringOption(filter => filter.setName("filter")
                .setDescription("Filter commands")
                .setRequired(false)
            ),
        async execute(interaction, client, action) {
            // Command executed
            let filter = !interaction.options.getString('filter') ? '' : interaction.options.getString('filter');
            let visibleCommands = Object.keys(slash);
                visibleCommands = filterVisibleCommands(visibleCommands, filter, interaction.member, action, config);
            
            // Create embeds
            let embeds = makePages(visibleCommands, slash, client, action, language, '/', config.embedColor);
            
            // Create buttons
            const buttons = [
                new MessageButton()
                    .setCustomId("previousbtn")
                    .setLabel("Previous")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("nextbtn")
                    .setLabel("Next")
                    .setStyle("SUCCESS")
            ];

            // Send response
            try {
                await interaction.deferReply();
                await interactionPaginationEmbed(interaction, embeds, buttons, interactionTimeout);
            } catch (err) {
                console.error(err);
            }
        }
    }
}

// Functions
function createString(object = {}, commandName = '%command%') {
    let command = commandName;
    let args = "";

    for(let name in object){
        

        let arg = object[name].required ? argTypes['required'] : argTypes['optional'];
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
function addSlash(slashObject) {
    if(!slashObject) return;
    let slashJSON = slashObject.toJSON();
    let args = '';

    if(!slashJSON.name) return;

    for(let key of slashJSON.options){
        let arg = key.required ? argTypes['required'] : argTypes['optional'];
            arg = replaceAll(arg, '%arg%', key.name);
            arg = replaceAll(arg, '%values%', '');

        args += ' ' + arg;
    }
    
    args = args.trim();
    return slashJSON.name + ' ' + args;
}
function filterVisibleCommands(allCommands, filter, member, action, config) {
    if(!filter) return allCommands;

    return allCommands.filter((elmt) => {
        // Check permissions
        if(!confPerms(config, action, member, elmt)) return false;

        // Filter
        if(filter && filter.length > 0) { return elmt.toLowerCase().indexOf(filter.toLowerCase()) !== -1; }
        return true;
    });
}
function confPerms(config, action, member, elmt) {
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
function ifNewPage(i, intLimit) {
    return i >= (intLimit - 1);
}
function makePages(visibleCommands, allCommands, client, action, language, prefix, embedColor) {
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
                .setAuthor(action.get(language.help.title), client.user.displayAvatarURL())
                .setDescription(action.get(language.help.description))
                .setColor(embedColor)
                .setTimestamp());
        }

        // Add command
        embeds[current].addField(value, '```'+ prefix + allCommands[value] +'```', false);
    }

    return embeds;
}