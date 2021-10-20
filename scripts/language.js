const Fs = require('fs');
const Yml = require('yaml');
const Version = require('./version');
const { getRandomKey } = require('fallout-utility');

module.exports = function() {
    this.location = null;
    this.language = {};
    this.parse = () => {
        if (!this.location || this.location == null) throw new Error("No language location specified");
        let language = Fs.readFileSync(this.location, 'utf8');
            language = Yml.parse(language);

        if(language.version != Version) throw new Error("Unsupported language version. Version:" + language.version + "; Supported: " + Version);

        this.language = language;
        return language;
    };
    this.get = (language) => {
        return getRandomKey(language);
    }
}