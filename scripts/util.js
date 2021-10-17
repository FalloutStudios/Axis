// Modules
const Prompt = require('prompt-sync')();

// Export
module.exports = function() {
    // Loop string
    this.loop = (num = 0, str = '') => {
        var returnVal = '';
        for (let i = 0; i < num; i++) {
            returnVal += str;
        }
        return returnVal;
    }
    // Replace all from string
    this.replaceAll = (str, find, replace) => {
        if(str == null) { return; }
        return str.toString().replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }
    // Random int
    this.randomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Limit string length
    this.limitText = (text = null, length = 0) => {
        if(text != null && text.length >= length){
            text = text.substr(0,length) + "...";
        }
        return text;
    }
    // Escape RegExp pattern from string
    this.escapeRegExp = (string) => {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    // Check if number
    this.isNumber = (number) => {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }   
    // Split words from string without including quotes
    this.splitString = (text = '', removeQuotations = false) => {
        let regex = new RegExp("(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*) (?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        text = text.trim();
        text = this.escapeRegExp(text);
        text = text.split(regex);
        if(removeQuotations){
            let newText = [];
            for (const value of text) {
                newText.push(this.replaceAll(value, '"', ''));
            }
            text = newText;
        }
    
        return this.replaceAll(text, "\\", '');
    }
    // Make sentence from array of words
    this.makeSentence = (object = [], skip = 0) => {
        if(typeof object === 'object' && Object.keys(object).length > 0) {
            let outputText = '';
            for (let i = 0; i < Object.keys(object).length; i++) {
                if(i < skip) { continue; }
    
                outputText += ' ' + object[Object.keys(object)[i]];
            }
            return outputText.trim();
        }
    }
    // Detect string with prefix
    this.recogniseCommand = (text = '', prefix = '>') => {
        if(typeof text !== 'string' || text.trim() === '') { return false; }
        if(typeof prefix !== 'string' || prefix.trim() === '') { return false; }
        if(text.substr(0, prefix.length).trim() !== prefix || text.substr(prefix.length).trim() === '') { return false; }

        return true;
    }
    // Get command information
    this.getCommand = (text = '', prefix = '') => {
        let response = {command: null, args: []};

        if(!recogniseCommand(text, prefix)) return response;

        response.args = this.splitCommand(message.slice(prefix.length).trim());
        response.command = args.shift().toLowerCase().trim();

        return response;
    }
    // Ask loop
    this.ask = (message) => {
        let ask = Prompt(message);
        while (true) {
            if(ask == 'exit' || ask == 'stop') process.exit(0);
            if(ask && ask != null) {
                break;
            }
            ask = Prompt(message);
        }
        return ask;
    }
}