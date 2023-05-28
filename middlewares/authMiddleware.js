// let validator = require('../util/validator');
let validator = new (require('../util/validator'))();

module.exports = class AuthMiddleware {


    canSignup = (req, res, next) => {
        let validationObj = {
            name: {
                isNotEmpty: true,
                isMinLength: true
            },
            email: {
                isNotEmpty: true,
                isValid: true
            },
            password: {
                isNotEmpty: true,
                isMinLength: true
            }
        };
        validationObj['name']['isNotEmpty'] = req.body.name.trim().length > 0;
        validationObj['name']['isMinLength'] = req.body.name.trim().length > 2;
        validationObj['email']['isNotEmpty'] = req.body.email.trim().length > 0;
        validationObj['email']['isValid'] = req.body.email.includes('@') && req.body.email.includes('.');
        validationObj['password']['isNotEmpty'] = req.body.password.trim().length > 0;
        validationObj['password']['isMinLength'] = req.body.password.trim().length > 7;
        if (validator.isValid(validationObj)) {
            // Call the next middleware function
            next();
        } else {
            let message = [];
            if (!validationObj.name.isNotEmpty && !validationObj.name.isMinLength) {
                message.push('Name is required');
            }
            if (validationObj.name.isNotEmpty && !validationObj.name.isMinLengt) {
                message.push('Name must be atleast 3 characters long');
            }
            if (!validationObj.email.isNotEmpty && !validationObj.email.isValid) {
                message.push('Email is required');
            }
            if (validationObj.email.isNotEmpty && !validationObj.email.isValid) {
                message.push('Email is not valid');
            }
            if (!validationObj.password.isNotEmpty && !validationObj.password.isMinLength) {
                message.push('Password is required');
            }
            if (!validationObj.password.isMinLength && validationObj.password.isNotEmpty) {
                message.push('Password must be atleast 8 characters long');
            }
            res.template.data = {};
            res.template.message = message;
            res.template.success = false;
            res.template.status = 200;
            res.status(200);
            res.json(res.template);
        }
    }

    canLogin = (req, res, next) => {
        let validationObj = {
            email: {
                isNotEmpty: true,
                isValid: true
            },
            password: {
                isNotEmpty: true
            }
        };

        validationObj['email']['isNotEmpty'] = req.body.email.trim().length > 0;
        validationObj['email']['isValid'] = req.body.email.includes('@') && req.body.email.includes('.');
        validationObj['password']['isNotEmpty'] = req.body.password.trim().length > 0;
        if (validator.isValid(validationObj)) {
            // Call the next middleware function
            next();
        } else {
            let message = [];
            if (!validationObj.email.isNotEmpty && !validationObj.email.isValid) {
                message.push('Email is required');
            }
            if (validationObj.email.isNotEmpty && !validationObj.email.isValid) {
                message.push('Email is not valid');
            }
            if (!validationObj.password.isNotEmpty && !validationObj.password.isMinLength) {
                message.push('Password is required');
            }
            res.template.data = {};
            res.template.message = message;
            res.template.success = false;
            res.template.status = 200;
            res.status(200);
            res.json(res.template);
        }
    }
}