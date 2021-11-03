const Fs = require('fs');
const Yml = require('yaml');
const Version = require('./version');

module.exports = class {
    /**
     * @param {string} language location of the language file
     */
    constructor(location) {
        this.location = location;
    }

    parse() {
        if(!this.location || this.location == null) throw new Error("No language location specified");
        let language = Fs.readFileSync(this.location, 'utf8');
            language = Yml.parse(language);
        
        if(language.version != Version) throw new Error("Unsupported language version. Version:" + language.version + "; Supported: " + Version);

        return language;
    }
}