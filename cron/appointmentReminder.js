const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Run every day at 8 AM
cron.schedule("0 8 * * *", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
        date: { $gte: tomorrow, $lt: nextDay },
        status: "approved",
    })
        .populate("patient", "email name")
        .populate("doctor", "name");

    for (let appointment of appointments) {
        await sendEmail(
            appointment.patient.email,
            "Vaccination Appointment Reminder",
            `<p>Dear ${appointment.patient.name},</p>
             <p>This is a reminder for your vaccination appointment with Dr. ${appointment.doctor.name} tomorrow.</p>`
        );
    }
});
