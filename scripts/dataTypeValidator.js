module.exports = {
    /**
     * 
     * @param {*} value - determines whether the value is a valid boolean
     * @returns {boolean} - returns true if the value is a valid boolean
     */
    boolean(value) {
        return value === true || value === false;
    },

    /**
     * 
     * @param {*} value - determines whether the value is a function
     * @returns {boolean} - returns true if the value is a function
     */
    function(value) {
        return typeof value === 'function';
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid array
     * @returns {boolean} - returns true if the value is a valid array
     */
    array(value) {
        return Array.isArray(value);
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid object
     * @returns {boolean} - returns true if the value is a valid object
     */
    object(value) {
        return typeof value === 'object' && value !== null;
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid string
     * @returns {boolean} - returns true if the value is a valid string
     */
    string(value) {
        return typeof value === 'string';
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid int
     * @returns {boolean} - returns true if the value is a valid int
     */
    int(value) {
        return typeof value === 'number' && value % 1 === 0;
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid float
     * @returns {boolean} - returns true if the value is a valid float
     */
    float(value) {
        return typeof value === 'number' && value % 1 !== 0;
    },

    /**
     * 
     * @param {*} value - determines whether the value array only contains valid data types
     * @param {*} propertyDataType - data type of array properties
     * @returns {boolean} - returns true if the value array only contains valid data types
     */
    arrayDataTypeProperties(value, propertyDataType) {
        return this.array(value) && value.every(v => typeof v === propertyDataType);
    },

    /**
     * 
     * @param {*} value - determines whether the value is a valid module name
     * @returns {boolean} - returns true if the value is a valid module name
     */
    moduleName(value) {
        return this.string(value) && value.match(/^[a-z]+$/);
    }
}