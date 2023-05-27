let factory = require('../util/factory')

module.exports = class ProductsController {

    constructor() { }

    async login(req, res) {
        const passwordsMatch = await factory.helpers.comparePasswords(enteredPassword, hashedPassword);
        if (passwordsMatch) {
            console.log('Passwords match');
        } else {
            console.log('Passwords do not match');
        }
        res.template.data = { example: 'Some data' };
        res.json(res.template);
    }

    async signup(req, res) {

        factory.user.findOne({ email: req.body.email })
            .then(async (user) => {
                if (user) {
                    res.send({
                        success: false,
                        data: {},
                        message: 'Email already exists',
                        status: 400
                    })
                } else {
                    const verificationToken = factory.helpers.generatUniqueId();
                    const newUser = new factory.user({
                        name: req.body.name,
                        email: req.body.email,
                        password: await factory.helpers.encryptPassword(req.body.password),
                        isAccountVerified: false,
                        verificationToken
                    });

                    // Send verification email to user
                    factory.helpers.sendVerificationEmail(req.body.email, verificationToken);

                    // Save the user to the User collection in MongoDB
                    factory.user.create(newUser)
                        .then((savedUser) => {
                            res.template.data = {};
                            res.template.message = 'User created successfully';
                            res.json(res.template);
                        })
                        .catch((error) => {
                            res.send({
                                success: false,
                                data: {},
                                message: 'User not created. Due to some error from Database',
                                status: 400
                            })
                        });
                }
            })
            .catch((error) => {
                res.send({
                    success: false,
                    data: {},
                    message: 'User not created. Due to some error from Database',
                    status: 400
                })
            });

    }

}