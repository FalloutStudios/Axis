const Fs = require('fs');
const Path = require('path');
const Yml = require('yaml');

/**
* @param {string} location - The location of the yml config file.
* @param {*} contents - The content of the file. This will automatically be converted to yml if it's an object
* @param {boolean} [overwrite=false] - Whether or not to overwrite the file if it already exists.
* @returns {Object} - File contents with utf8 encoding.
*/
module.exports = (location, contents, overwrite = false) => {
    if((Path.extname(location) === '.yml' || Path.extname(location) === '.yaml') && typeof contents === 'object') contents = Yml.stringify(contents);
    if(typeof contents === 'object') contents = JSON.stringify(contents);
    
    if(Fs.existsSync(location) && overwrite || !Fs.existsSync(location)) {
        Fs.mkdirSync(Path.dirname(location), { recursive: true });
        Fs.writeFileSync(location, contents.toString());
    }

    return Fs.readFileSync(location, 'utf-8');
}
