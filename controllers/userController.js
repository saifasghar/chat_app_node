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
                                friends: user.friends
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
        let token = req.headers.authorization;
        token = token.replace(/bearer /ig, "");
        const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
        if (decodedToken.userEmail !== req.body.email) {
            factory.user.findOne({
                email: req.body.email,
                $or: [
                    {
                        'notifications.type': 'friendRequest',
                        'notifications.user.email': decodedToken.userEmail,
                    },
                    {
                        'friendRequests.sender.email': decodedToken.userEmail,
                    }
                ]
            }).then(async foundUser => {
                if (foundUser) {
                    res.template.message = 'Friend request already sent.';
                    res.template.success = false;
                    res.json(res.template);
                } else {
                    let request = {
                        sender: {
                            email: decodedToken.userEmail,
                            name: decodedToken.userName,
                            profileImageLink: 'assets/img/avatars/11.jpg'
                        },
                        message: req.body.message,
                        datenTime: new Date(),
                        id: await factory.helpers.generatUniqueId()
                    };
                    let newNotification = {
                        type: 'friendRequest',
                        ...request,
                    };
                    factory.user.findOneAndUpdate({ email: req.body.email }, { $push: { notifications: newNotification, friendRequests: request } }, { upsert: true, new: true }).then(async user => {
                        if (user) {
                            res.template.message = 'Friend request sent.';
                            res.json(res.template);
                        } else {
                            res.template.message = 'Invalid email address';
                            res.template.success = false;
                            res.json(res.template);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            res.template.success = false;
            res.template.message = 'You cannot send request to yourself.';
            res.json(res.template)
        }
    }

    async acceptFriendRequest(req, res) {
        let token = req.headers.authorization;
        token = token.replace(/bearer /ig, "");
        const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
        let friend = {
            status: {
                isActive: true,
                isBlocked: false,
                activityStatus: 'online',
            },
            info: {
                profileImageLink: 'assets/img/avatars/6.jpg',
                fullName: decodedToken.userName,
                email: decodedToken.userEmail,
            },
            chat: []
        };
        let notification = {
            type: 'requestAccepted',
            user: {
                email: decodedToken.userEmail,
                name: decodedToken.userName,
                profileImageLink: 'assets/img/avatars/6.jpg'
            },
            datenTime: new Date(),
            id: factory.helpers.generatUniqueId()
        }
        factory.user.findOneAndUpdate({ email: req.body.email },
            {
                $push: {
                    friends: friend,
                    notifications: notification
                }
            },
            { new: true }).then(async user => {
                if (user) {
                    let friend2 = {
                        status: {
                            isActive: true,
                            isBlocked: false,
                            activityStatus: 'online',
                        },
                        info: {
                            profileImageLink: 'assets/img/avatars/6.jpg',
                            fullName: user.name,
                            email: user.email,
                        },
                        chat: []
                    };
                    factory.user.findOneAndUpdate(
                        { email: decodedToken.userEmail },
                        {
                            $pull: {
                                notifications: {
                                    id: req.body.notificationId
                                },
                                friendRequests: {
                                    id: req.body.notificationId
                                }
                            },
                            $push: {
                                friends: friend2
                            }
                        },
                        { new: true, upsert: true }
                    ).then(updatedUser => {
                        res.template.message = 'Friend request accepted successfully.';
                        res.json(res.template);
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    res.template.message = 'User not found(who sent friend request).';
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

    async clearNotifications(req, res) {
        let token = req.headers.authorization;
        token = token.replace(/bearer /ig, "");
        const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
        let query = {};
        if (req.params.id == 'all') {
            query = { notifications: [] };
        } else {
            query = { $pull: { notifications: { id: req.params.id } } };
        }
        factory.user.findOneAndUpdate({ email: decodedToken.userEmail }, query, { upsert: true, new: true }).then(user => {
            if (user) {
                res.template.data = user.notifications;
                res.template.message = `${req.params.id == 'all' ? 'Notifications' : 'Notification'} cleared successfully`;
                res.json(res.template);
            } else {
                res.template.success = false;
                res.template.message = 'User not found';
                res.json(res.template);
            }
        }).catch(err => {
            console.log(err);
        });
    }
}