const Fs = require('fs');
const Path = require('path');
const Yml = require('yaml');

module.exports = (location, contents) => {
    if(typeof location === 'object') contents = Yml.stringify(contents);

    if(!Fs.existsSync(location)) {
        Fs.mkdirSync(Path.dirname(location), { recursive: true });
        Fs.writeFileSync(location, contents.toString());
    }

    return Yml.parse(Fs.readFileSync(location, 'utf8'));
}
