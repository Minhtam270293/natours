const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Shiro <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // POSTMARK

            return nodemailer.createTransport({
                host: process.env.POSTMARK_HOST,
                port: process.env.POSTMARK_PORT,
                auth: {
                    user: process.env.POSTMARK_EMAIL_USER,
                    pass: process.env.POSTMARK_EMAIL_PASS
                }
            });         
        }

        return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                 auth: {
                     user: process.env.EMAIL_USERNAME,
                     pass: process.env.EMAIL_PASSWORD
                 }
             })
    }

    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        }

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
       await this.send('welcome', 'Welcome to the Natours Family!')
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset', 
            'Your password reset token (valid ofr only 10 minutes)')
    }
}