'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetLink - The password reset URL
 */
async function sendResetEmail(to, resetLink) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <div style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #777; font-size: 12px;">This link will expire in 1 hour.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendResetEmail };
