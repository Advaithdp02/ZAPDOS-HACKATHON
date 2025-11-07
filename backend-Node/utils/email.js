// utils/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// simple wrapper
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};

/* Small template helpers (you can replace with a templating engine later) */

export const templates = {
  recruitmentRoundCreated: ({ studentName, jobRole, roundName, roundDate, roundUrl }) => ({
    subject: `New Recruitment Round: ${jobRole} — ${roundName}`,
    html: `
      <p>Hi ${studentName},</p>
      <p>A new recruitment round "<strong>${roundName}</strong>" for <strong>${jobRole}</strong> has been scheduled on <strong>${new Date(roundDate).toLocaleString()}</strong>.</p>
      ${roundUrl ? `<p>Details: <a href="${roundUrl}">View Round</a></p>` : ""}
      <p>Best,<br/>Placement Team</p>
    `,
    text: `Hi ${studentName},\nA new recruitment round "${roundName}" for ${jobRole} is scheduled on ${new Date(roundDate).toLocaleString()}.`,
  }),

  statusUpdated: ({ studentName, jobRole, roundName, status, remarks, detailsUrl }) => ({
    subject: `Status Update: ${jobRole} — ${status}`,
    html: `
      <p>Hi ${studentName},</p>
      <p>Your status for <strong>${jobRole}</strong> (${roundName}) has been updated to: <strong>${status}</strong>.</p>
      ${remarks ? `<p>Remarks: ${remarks}</p>` : ""}
      ${detailsUrl ? `<p>Details: <a href="${detailsUrl}">View details</a></p>` : ""}
      <p>Regards,<br/>Placement Team</p>
    `,
    text: `Hi ${studentName},\nYour status for ${jobRole} (${roundName}) is now: ${status}.\n${remarks ? `Remarks: ${remarks}` : ""}`,
  }),

  offerUploaded: ({ studentName, jobRole, offerUrl }) => ({
    subject: `Offer Letter Uploaded — ${jobRole}`,
    html: `
      <p>Hi ${studentName},</p>
      <p>Congratulations — an offer letter for the role <strong>${jobRole}</strong> has been uploaded.</p>
      ${offerUrl ? `<p>Download: <a href="${offerUrl}">Your Offer Letter</a></p>` : ""}
      <p>Best wishes,<br/>Placement Team</p>
    `,
    text: `Hi ${studentName},\nAn offer letter for ${jobRole} has been uploaded. Download: ${offerUrl || ""}`,
  }),
  // utils/email.js (inside templates object)
driveEnrollment: ({ studentName, jobRole, company, roundUrl }) => ({
  subject: `Enrolled: ${jobRole} drive at ${company}`,
  html: `
    <p>Hi ${studentName},</p>
    <p>You have successfully <strong>enrolled</strong> in the <strong>${jobRole}</strong> drive at <strong>${company}</strong>.</p>
    ${roundUrl ? `<p>Track your status: <a href="${roundUrl}">View drive</a></p>` : ""}
    <p>Best,<br/>Placement Team</p>
  `,
  text: `Hi ${studentName},\nYou have enrolled in the ${jobRole} drive at ${company}. Track: ${roundUrl || ""}`
}),

driveStatusUpdate: ({ studentName, jobRole, roundName, status, remarks, detailsUrl }) => ({
  subject: `Update: ${jobRole} — ${status}`,
  html: `
    <p>Hi ${studentName},</p>
    <p>Your status for <strong>${jobRole}</strong> — round: <em>${roundName}</em> — has been updated to: <strong>${status}</strong>.</p>
    ${remarks ? `<p>Remarks: ${remarks}</p>` : ""}
    ${detailsUrl ? `<p>Details: <a href="${detailsUrl}">View</a></p>` : ""}
    <p>Regards,<br/>Placement Team</p>
  `,
  text: `Hi ${studentName},\nYour status for ${jobRole} (${roundName}) is now: ${status}.\n${remarks || ""}\n${detailsUrl || ""}`
}),

offerUploaded: ({ studentName, jobRole, offerUrl }) => ({
  subject: `Offer Letter Uploaded — ${jobRole}`,
  html: `
    <p>Hi ${studentName},</p>
    <p>Congratulations — an offer letter for the role <strong>${jobRole}</strong> has been uploaded.</p>
    ${offerUrl ? `<p>Download: <a href="${offerUrl}">Your Offer Letter</a></p>` : ""}
    <p>Best wishes,<br/>Placement Team</p>
  `,
  text: `Hi ${studentName},\nAn offer letter for ${jobRole} has been uploaded. Download: ${offerUrl || ""}`
})

};
