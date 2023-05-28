const factory = require('../util/factory');


module.exports = class AuthMiddleware {

    async isValid(req, res, next) {
        let token = req.headers.authorization;
        if (token) {
            token = token.replace(/bearer /ig, "");
            if (token) {
                const decodedToken = await factory.helpers.verifyToken(token);
                if (decodedToken) {
                    factory.user.findOne({ email: decodedToken.userEmail }).then(user => {
                        if (user) {
                            next();
                        } else {
                            res.status(401);
                            return res.send({
                                data: null,
                                success: false,
                                message: 'Invalid Token',
                                status: 401
                            });
                        }
                    }).catch(error => {
                        if (error) {
                            console.log(error);
                        }
                    })
                } else {
                    res.status(401);
                    return res.send({
                        data: null,
                        success: false,
                        message: 'Invalid Token',
                        status: 401
                    });
                }
            }
        } else {
            res.status(401);
            res.send({
                data: null,
                success: false,
                message: 'Invalid Token',
                status: 401
            });
        }
    }
}