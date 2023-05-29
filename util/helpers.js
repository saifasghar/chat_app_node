let { v4: uuidv4 } = require('uuid'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken');


module.exports = class Helpers {
    generatUniqueId() {
        let uniqueId = uuidv4();
        return uniqueId;
    }

    async encryptPassword(plainPassword) {
        try {
            // Generate a salt and hash the password
            const hash = await bcrypt.hash(plainPassword, 10);
            return hash;
        } catch (error) {
            console.log('Failed to hash password:', error);
        }
    }

    async comparePasswords(enteredPassword, hashedPassword) {
        try {
            const result = await bcrypt.compare(enteredPassword, hashedPassword);
            return result;
        } catch (error) {
            console.log('Failed to compare passwords:', error);
        }
    }

    sendEmail(toEmail, htmlTemplate, subject) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: toEmail,
            subject,
            html: htmlTemplate,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }

    async generateJwtToken(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET_KEY, {}, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return decoded;
        } catch (error) {
            // Handle verification errors, such as an invalid token or token expiration
            return false;
        }
    }
}