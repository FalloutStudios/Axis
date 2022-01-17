const Fs = require('fs');
const Yml = require('yaml');
const MakeConfig = require('../makeConfig');
const Version = require('../version');
const { replaceAll } = require('fallout-utility');

module.exports = class Language {
    /**
     * @param {string} language location of the language file
     */
    constructor(location) {
        this.location = location;
    }

    parse() {
        if(!this.location || this.location == null) throw new Error("No language location specified");

        const language = Yml.parse(MakeConfig(this.location, generateLang()));
        
        if(language.version != Version) throw new Error("Unsupported language version. Version:" + language.version + "; Supported: " + Version);
        this.language = language;

        return this;
    }

    getLanguage() {
        return this.language;
    }
}

function generateLang() {
    return replaceAll(Fs.readFileSync('./scripts/config/src/language.yml', 'utf8'), '${Version}', Version);
}