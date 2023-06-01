let factory = require('../util/factory')

module.exports = class UserController {

    constructor() { }

    test(req, res, next) {
        res.template.data = {};
        res.json(res.template)
    }

    async fetchAllFriends(req, res) {
        let token = req.headers.authorization;
        if (token) {
            token = token.replace(/bearer /ig, "");
            if (token) {
                const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
                if (decodedToken) {
                    factory.user.findOne({ email: decodedToken.userEmail }).then(user => {
                        if (user) {
                            // res.template.data = { friends: user.friends || [] };
                            res.template.data = {
                                friends: [
                                    {
                                        status: {
                                            isActive: true,
                                            isBlocked: false,
                                            activityStatus: 'online',
                                        },
                                        info: {
                                            profileImageLink: 'assets/img/avatars/6.jpg',
                                            fullName: 'Damian Binder',
                                            email: 'mixture030030@gmail.com',
                                        },
                                        chat: []
                                    },
                                    {
                                        status: {
                                            isActive: true,
                                            isBlocked: false,
                                            activityStatus: 'online',
                                        },
                                        info: {
                                            profileImageLink: 'assets/img/avatars/6.jpg',
                                            fullName: 'Damian Binder',
                                            email: 'mixture030030@gmail.com',
                                        },
                                        chat: []
                                    },
                                    {
                                        status: {
                                            isActive: true,
                                            isBlocked: false,
                                            activityStatus: 'online',
                                        },
                                        info: {
                                            profileImageLink: 'assets/img/avatars/6.jpg',
                                            fullName: 'Damian Binder',
                                            email: 'mixture030030@gmail.com',
                                        },
                                        chat: []
                                    },
                                ]
                            };

                            res.template.message = 'Friends found successfully';
                            res.json(res.template);
                        } else {
                            res.template.message = 'User not found';
                            res.template.success = false;
                            res.json(res.template);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('Invalid Token');
                }
            } else {
                console.log('Invalid Token');
            }
        } else {
            console.log('Invalid Token');
        }
    }

    async sendFriendRequest(req, res) {
        factory.user.findOne({ email: req.body.email }).then(async user => {
            if (user) {
                let token = req.headers.authorization;
                token = token.replace(/bearer /ig, "");
                const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
                let newNotifications = [...user.notifications, {
                    type: 'friendRequest',
                    sender: {
                        email: decodedToken.userEmail,
                        name: decodedToken.userName,
                        profileImageLink: 'assets/img/avatars/11.jpg'
                    },
                    message: req.body.message,
                    datenTime: new Date()
                }];
                factory.user.findOneAndUpdate({ email: req.body.email }, { notifications: newNotifications }, { upsert: true, new: true }).then(user => {
                    if (user) {
                        res.template.message = 'Friend request sent.';
                        res.json(res.template);
                    } else {
                        console.log('User not found');
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                res.template.message = 'Invalid email address';
                res.template.success = false;
                res.json(res.template);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    async fetchAllNotifications(req, res) {
        let token = req.headers.authorization;
        token = token.replace(/bearer /ig, "");
        const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
        factory.user.findOne({ email: decodedToken.userEmail }).then(user => {
            if (user) {
                res.template.data = { notifications: user.notifications };
                res.template.message = 'Notification found successfully';
                res.json(res.template);
            } else {
                console.log('User not found');
            }
        }).catch(err => {
            console.log(err);
        });
    }
}