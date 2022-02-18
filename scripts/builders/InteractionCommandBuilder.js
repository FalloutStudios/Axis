const DataTypeValidator = require('../dataTypeValidator');
const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class InteractionCommandBuilder {
    constructor() {
        this.type = 'InteractionCommand';
        this.name = null;
        this.allowExecViaDm = false;
        this.command = new SlashCommandBuilder();
        this.execute = () => { /* function */ };
    }
    
    /**
     * 
     * @param {function(CommandInteraction, Client)} execute - Function to execute when the command is called.
     * @returns 
     */
    setExecute(execute) {
        if(!DataTypeValidator.function(execute)) throw new TypeError('Invalid argument: `execute` must be a function');
        this.execute = execute;
        return this;
    }

    /**
     * 
     * @param {boolean} allow - Set whether the command can be executed via DM when available.
     */
    setAllowExecuteViaDm(allow) {
        if(!DataTypeValidator.boolean(allow)) throw new TypeError('Invalid argument: `allow` must be a boolean');
        this.allowExecViaDm = allow;
        return this;
    }

    /**
     * 
     * @param {(SlashCommandBuilder|function(SlashCommandBuilder))} command - Set commands to be executed when the command is called.
     * @returns 
     */
    setCommand(command) {
        if(!(DataTypeValidator.function(command) || DataTypeValidator.object(command))) throw new TypeError('Invalid argument: `command` must be a function or an object');

        this.command = typeof command === 'object' ? command : command(new SlashCommandBuilder(this));
        this.name = this.command.name;
        return this;
    }
}
