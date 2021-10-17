const Prompt = require('prompt-sync')();

module.exports = function() {
    this.loop = (num = 0, str = '') => {
        var returnVal = '';
        for (let i = 0; i < num; i++) {
            returnVal += str;
        }
        return returnVal;
    }
    this.replaceAll = (str, find, replace) => {
        if(str == null) { return; }
        return str.toString().replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }
    this.randomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.limitText = (text = null) => {
        if(text != null && text.length >= 100){
            text = text.substr(0,100) + "...";
        }
        return text;
    }
    this.trimUnicode = (text) => {
        if(text == null) {return true;}
        text = text.trim();
        text = this.replaceAll(text,"'",'');
        text = this.replaceAll(text,".",'');
        text = this.replaceAll(text,"/",'');
        text = this.replaceAll(text,"\\",'');
        return text;
    }
    this.trimUnicode = (text) => {
        if(text == null) {return true;}
        text = text.trim();
        text = this.replaceAll(text,"'",'');
        text = this.replaceAll(text,".",'');
        text = this.replaceAll(text,"/",'');
        text = this.replaceAll(text,"\\",'');
        return text;
    }
    this.escapeRegExp = (string) => {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    this.isNumber = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }   
    this.splitCommand = (text = '', removeQuotations = false) => {
        let regex = new RegExp("(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*) (?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        text = text.trim();
        text = this.escapeRegExp(text);
        text = text.split(regex);
        if(removeQuotations){
            let newText = [];
            for (const value of text) {
                newText.push(this.replaceAll(this.replaceAll(value, '"', ''), "\\", ''));
            }
            text = newText;
        }
    
        return text;
    }
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
    this.recogniseCommand = (text = '', prefix = '') => {
        if(typeof text !== 'string' || text.trim() === '') { return false; }
        if(typeof prefix !== 'string' || prefix.trim() === '') { return false; }
        if(text.substr(0, prefix.length).trim() !== prefix || text.substr(prefix.length).trim() === '') { return false; }

        return true;
    }
    this.getCommand = (text = '', prefix = '') => {
        let response = {command: null, args: []};

        if(!recogniseCommand(text, prefix)) return response;

        response.args = this.splitCommand(message.slice(prefix.length).trim());
        response.command = args.shift().toLowerCase().trim();

        return response;
    }
    this.ask = (message) => {
        let ask = Prompt(message);
        while (true) {
            if(ask && ask != null) {
                break;
            }
            ask = Prompt(message);
        }
        return ask;
    }
}