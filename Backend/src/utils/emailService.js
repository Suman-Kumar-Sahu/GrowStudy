import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


export const sendStatusEmail = async (to, name, jobTitle, status) => {
  let subject = "";
  let message = "";

  if (status === "selected") {
    subject = `Congratulations! You've been Selected for ${jobTitle}`;
    message = `
      <h3>Hi ${name},</h3>
      <p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> has been <strong>SELECTED</strong>.</p>
      <p>The HR team will reach out to you shortly with the next steps.</p>
      <p>Best Regards,<br/>Recruitment Team</p>
    `;
  } else if (status === "rejected") {
    subject = `Update on your application for ${jobTitle}`;
    message = `
      <h3>Hi ${name},</h3>
      <p>Thank you for your interest in the <strong>${jobTitle}</strong> position.</p>
      <p>After careful consideration, we have decided not to move forward with your application at this time.</p>
      <p>We wish you the best in your job search.</p>
    `;
  } else {
    subject = `Application Status Update: ${jobTitle}`;
    message = `<p>Hi ${name}, your application status for <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong>.</p>`;
  }

  try {
    await transporter.sendMail({
      from: `"Job Portal Team" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: message,
    });
    console.log(`Email sent to ${to} regarding ${status}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};