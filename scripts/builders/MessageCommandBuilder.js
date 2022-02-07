const DataTypeValidator = require('../dataTypeValidator');

module.exports = class MessageCommandBuilder {
    constructor() {
        this.type = 'MessageCommand';
        this.name = null;
        this.allowExecViaDm = false;
        this.description = null;
        this.arguments = [];
        this.execute = () => { /* function */ };
    }

    /**
     * 
     * @param {string} name - The name. Needs to be lowercase and without spaces or special characters.
     */
    setName(name) {
        if(!DataTypeValidator.moduleName(name)) throw new TypeError('Name must be a lowercase string without special characters and whitespace');
        this.name = name;
        return this;
    }

    /**
     * 
     * @param {boolean} allow - Set whether the command can be executed via DM. 
     */
    setAllowExecuteViaDm(allow) {
        if(!DataTypeValidator.boolean(allow)) throw new TypeError('Invalid argument: `allow` must be a boolean');
        this.allowExecViaDm = allow;
        return this;
    }

    /**
     * 
     * @param {string} description - Command description.
     * @returns 
     */
    setDescription(description) {
        this.description = description;
        return this;
    }

    /**
     * 
     * @param {function} execute - Function to execute when the command is called.
     * @returns 
     */
    setExecute(execute) {
        if(!DataTypeValidator.function(execute)) throw new TypeError('Invalid argument: `execute` must be a function');
        this.execute = execute;
        return this;
    }

    /**
     * 
     * @param {string} name - Argument lowercase name without special characters and whitespace.
     * @param {boolean} required - Set if the argument is required or not
     * @param {string} description - Description of the argument
     * @param {Object} values - Array of string values
     * @returns 
     */
    addArgument(name = '', required = false, description = '', values = []) {
        if(!DataTypeValidator.moduleName(name)) throw new TypeError('Invalid argument: Argument `name` must be a lowercase string without special characters and whitespace');
        if(!DataTypeValidator.boolean(required)) throw new TypeError('Invalid argument: `required` must be a boolean');
        if(!DataTypeValidator.arrayDataTypeProperties(values, 'string')) throw new TypeError('Invalid argument: `values` must be an array of strings');

        this.arguments.push({
            name: name,
            required: required,
            description: description,
            values: values
        });
        return this;
    }
}