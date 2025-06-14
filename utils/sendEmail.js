const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or use your SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: `"Vaccination System" <${process.env.EMAIL_HOST}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Email error:", err.message);
    }
};

module.exports = sendEmail;
