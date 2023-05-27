module.exports = class Validator {
    isValid(obj) {
        let pass = true;
        for (let mainKey of Object.keys(obj)) {
            for (let subKey of Object.keys(obj[mainKey])) {
                if (!obj[mainKey][subKey]) {
                    pass = false;
                    break;
                }
            }
        }
        return pass;
    }
}