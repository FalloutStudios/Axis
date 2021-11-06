const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = class Builder {
    constructor() {
        this.type = 'InteractionCommand';
        this.name = null;
        this.command = new SlashCommandBuilder();
        this.execute = () => { /* function */ };
    }
    
    /**
     * 
     * @param {function} execute - Function to execute when the command is called.
     * @returns 
     */
    setExecute(execute) {
        if(!validateFunction(execute)) throw new TypeError('Invalid argument: `execute` must be a function');
        this.execute = execute;
        return this;
    }

    // A method that will create a new instance of SlashCommandBuilder
    setCommand(command) {
        if(!validateFunction(command)) throw new TypeError('Invalid argument: `command` must be a function');

        this.command = command(new SlashCommandBuilder(this)).toJSON();
        this.name = this.command.name;
        return this;
    }
}

function validateFunction(value) {
    return typeof value === 'function';
}