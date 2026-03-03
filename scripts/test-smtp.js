const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function test() {
    console.log('Testing SMTP with:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        // pass hidden
    });

    try {
        await transporter.verify();
        console.log('Success: Connection is ready');

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.SMTP_USER, // send to self
            subject: 'SMTP Test',
            text: 'If you see this, SMTP is working!',
        });
        console.log('Success: Test email sent');
    } catch (err) {
        console.error('Error during SMTP test:', err);
    }
}

test();
