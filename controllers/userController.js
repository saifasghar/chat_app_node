let factory = require('../util/factory')

module.exports = class UserController {

    constructor() { }

    test(req, res, next) {
        res.template.data = {};
        res.json(res.template)
    }

}