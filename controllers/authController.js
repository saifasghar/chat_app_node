let factory = require('../util/factory')

module.exports = class AuthController {

    constructor() { }

    async login(req, res) {
        factory.user.findOne({ email: req.body.email }).then(async (user) => {
            if (user) {
                if (user.isAccountVerified) {
                    const passwordsMatch = await factory.helpers.comparePasswords(req.body.password, user.password);
                    if (passwordsMatch) {
                        try {
                            const token = await factory.helpers.generateJwtToken({ userId: user._id, userName: user.name, userEmail: user.email });
                            res.template.message = 'Successfully logged in.';
                            res.template.data = { jwt_token: token };
                            res.json(res.template);
                            factory.user.findOneAndUpdate({ email: req.body.email }, { status: { online: true } }).then(user => {
                                if (!user) {
                                    console.log('User not found');
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } catch (error) {
                            res.template.message = 'Error generating token';
                            res.template.success = false;
                            res.template.status = 404;
                            res.status(404);
                            res.json(res.template);
                        }
                    } else {
                        res.template.message = 'Incorrect Password';
                        res.template.success = false;
                        res.template.status = 200;
                        res.status(200);
                        res.json(res.template);
                    }
                } else {
                    res.template.message = 'Account not verified yet.';
                    res.template.success = false;
                    res.template.status = 200;
                    res.status(200);
                    res.json(res.template);
                }
            } else {
                res.template.message = 'Email not found';
                res.template.success = false;
                res.template.status = 200;
                res.status(200);
                res.json(res.template);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    async signup(req, res) {
        factory.user.findOne({ email: req.body.email })
            .then(async (user) => {
                if (user) {
                    res.template.message = 'Email already exists';
                    res.template.success = false;
                    res.template.status = 200;
                    res.status(200);
                    res.json(res.template);
                } else {
                    const verificationToken = factory.helpers.generatUniqueId();
                    const newUser = new factory.user({
                        name: req.body.name,
                        email: req.body.email,
                        password: await factory.helpers.encryptPassword(req.body.password),
                        isAccountVerified: false,
                        verificationToken,
                        notifications: []
                    });

                    let currYear = new Date().getFullYear();

                    // Send verification email to user
                    factory.helpers.sendEmail(req.body.email, `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Fiveluman</title>
                    </head>
                    
                    <body style="background: #F5F6F7; padding: 80px; font-family: 'Heebo', sans-serif; color: #0B2234; font-size: 17px;">
                        <div style="width: 640px; margin: 0 auto; background: white; padding: 50px 40px;">
                    
                        <p style="margin-bottom: 20px;">Hello ${req.body.name},</p>
        
                        <p style="margin-bottom: 20px;">Welcome to Chat App. Your account has been created.</p>
        
                        <p style="margin-bottom: 20px;">
                            Your Login: ${req.body.email}
                        </p>
        
                        <p>Thanks, <br> Chat App Team</p>
        
                            Please click on the following link to verify your account: http://localhost:4200/auth/account-verification/${verificationToken}
                            <div style="text-align: center;margin-top: 40px;">
                    
                                <p style="margin-top: 0px; font-size: 14px;">Chat App Copyright ${currYear}© </p>
                    
                            </div>
                    
                        </div>
                    </body>
                    
                    </html>`, 'Account Verification');

                    // Save the user to the User collection in MongoDB
                    factory.user.create(newUser)
                        .then((savedUser) => {
                            res.template.data = {};
                            res.template.message = 'User created successfully';
                            res.json(res.template);
                        })
                        .catch((error) => {
                            console.log(error);
                            res.template.message = 'User not created. Due to some error from Database';
                            res.template.success = false;
                            res.template.status = 400;
                            res.status(400);
                            res.json(res.template);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    verifyAccount(req, res, next) {
        factory.user.findOneAndUpdate({ verificationToken: req.body.token }, { isAccountVerified: true }, { new: true })
            .then((updatedUser) => {
                if (updatedUser) {
                    res.template.data = {};
                    res.template.message = 'Account verified successfully';
                    res.json(res.template);
                    factory.user.findOneAndUpdate(
                        { email: updatedUser.email },
                        { $unset: { verificationToken: 1 } },
                        { new: true }
                    )
                        .then(updatedDocument => {
                            if (updatedDocument) {
                                // console.log(updatedDocument);
                            } else {
                                console.log('Document not found.');
                            }
                        })
                        .catch(error => {
                            console.log('Error:', error);
                        });
                } else {
                    res.template.data = {};
                    res.template.message = 'User not found';
                    res.template.success = false;
                    res.template.status = 200;
                    res.status(200);
                    res.json(res.template);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    async verifyTokenAuthenticity(req, res, next) {
        let token = req.headers.authorization;
        if (token) {
            token = token.replace(/bearer /ig, "");
            if (token) {
                const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
                if (decodedToken) {
                    factory.user.findOne({ email: decodedToken.userEmail }).then(user => {
                        if (user) {
                            res.template.message = 'Token is valid. Authentication was successful.';
                            res.json(res.template);
                        } else {
                            res.status(200);
                            res.send({
                                data: null,
                                success: false,
                                message: 'Invalid Token',
                                status: 200
                            });
                        }
                    }).catch(error => {
                        if (error) {
                            console.log(error);
                        }
                    })
                } else {
                    res.status(200);
                    res.send({
                        data: null,
                        success: false,
                        message: 'Invalid Token',
                        status: 200
                    });
                }
            } else {
                res.status(200);
                res.send({
                    data: null,
                    success: false,
                    message: 'Invalid Token',
                    status: 200
                });
            }
        } else {
            res.status(200);
            res.send({
                data: null,
                success: false,
                message: 'Invalid Token',
                status: 200
            });
        }
    }

    sendResetPasswordEmail(req, res) {
        factory.user.findOne({ email: req.body.email }).then(user => {
            if (user) {
                const generatedResetPasswordToken = factory.helpers.generatUniqueId();
                if (user.resetPasswordToken) {
                    factory.user.findOneAndUpdate(
                        { email: req.body.email }, // Filter for the document you want to update
                        { resetPasswordToken: generatedResetPasswordToken }, // Update operation using $set to add the new field
                        { new: true }
                    ).then(updatedUser => {
                        sendEmailAndResponse(req, res, user, generatedResetPasswordToken);
                    })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    factory.user.findOneAndUpdate(
                        { email: req.body.email }, // Filter for the document you want to update
                        { $set: { resetPasswordToken: generatedResetPasswordToken } }, // Update operation using $set to add the new field
                        { new: true } // Options: return the modified document
                    ).then(updatedUser => {
                        sendEmailAndResponse(req, res, user, generatedResetPasswordToken);
                    })
                        .catch(err => {
                            console.log(err);
                        })
                }
            } else {
                res.status(200);
                res.template.message = 'User not found.';
                res.template.success = false;
                res.template.data = {};
                res.json(res.template);
            }
        }).catch(error => {
            if (error) {
                console.log(error);
            }
        })


        function sendEmailAndResponse(req, res, user, generatedResetPasswordToken) {
            let currYear = new Date().getFullYear();

            // Send verification email to user
            factory.helpers.sendEmail(req.body.email, `<!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Fiveluman</title>
                </head>

                <body style="background: #F5F6F7; padding: 80px; font-family: 'Heebo', sans-serif; color: #0B2234; font-size: 17px;">
                    <div style="width: 640px; margin: 0 auto; background: white; padding: 50px 40px;">

                    <p style="margin-bottom: 20px;">Hello ${user.name},</p>

                    <p style="margin-bottom: 20px;">
                        Your Login: ${req.body.email}
                    </p>

                    <p>Thanks, <br> Chat App Team</p>

                        Please click on the following link to reset your password: http://localhost:4200/auth/reset-password/${generatedResetPasswordToken}
                        <div style="text-align: center;margin-top: 40px;">

                            <p style="margin-top: 0px; font-size: 14px;">Chat App Copyright ${currYear}© </p>

                        </div>

                    </div>
                </body>

                </html>`, 'Reset Password');
            res.template.message = 'Reset password email sent successfuly.';
            res.json(res.template);
        }
    }

    async resetPassword(req, res) {
        if (req.body.token) {
            factory.user.findOneAndUpdate({ resetPasswordToken: req.body.token }, { password: await factory.helpers.encryptPassword(req.body.password) }).then(updatedUser => {
                if (updatedUser) {
                    res.template.message = 'Password updated successfully';
                    res.json(res.template);
                    factory.user.findOneAndUpdate(
                        { email: updatedUser.email },
                        { $unset: { resetPasswordToken: 1 } },
                        { new: true }
                    )
                        .then(updatedDocument => {
                            if (updatedDocument) {
                                // console.log(updatedDocument);
                            } else {
                                console.log('Document not found.');
                            }
                        })
                        .catch(error => {
                            console.log('Error:', error);
                        });
                } else {
                    res.template.message = 'Token has expired or is invalid';
                    res.template.success = false;
                    res.json(res.template);
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            res.template.message = 'Reset password token is required.';
            res.template.success = false;
            res.json(res.template);
        }
    }
}