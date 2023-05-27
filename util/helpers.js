let { v4: uuidv4 } = require('uuid'),
    bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer');

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
            throw new Error('Failed to hash password:', error);
        }
    }

    async comparePasswords(enteredPassword, hashedPassword) {
        try {
            const result = await bcrypt.compare(enteredPassword, hashedPassword);
            return result;
        } catch (error) {
            throw new Error('Failed to compare passwords:', error);
        }
    }

    sendVerificationEmail(toEmail, verificationToken) {
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
            subject: 'Account Verification',
            html: `Please click on the following link to verify your account: http://your-website.com/verify?token=${verificationToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
}