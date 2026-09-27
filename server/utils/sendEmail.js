const nodemailer = require("nodemailer");

/**
 * Send tournament registration confirmation email from arisesports13@gmail.com
 */
const sendRegistrationEmail = async ({ captainEmail, captainName, teamName, tournamentName, transactionId, ticketId }) => {
  try {
    // Configure Nodemailer transporter for arisesports13@gmail.com
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "arisesports13@gmail.com",
        pass: process.env.EMAIL_PASS || "" // App password if configured
      }
    });

    const mailOptions = {
      from: `"ARISE Esports Platform" <${process.env.EMAIL_USER || "arisesports13@gmail.com"}>`,
      to: captainEmail,
      subject: `🏆 Registration Confirmed: ${tournamentName} - ARISE Esports`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0e14; color: #ffffff; padding: 25px; borderRadius: 8px;">
          <h2 style="color: #00d2ff; text-transform: uppercase;">ARISE Esports Tournament Registration</h2>
          <p>Dear <strong>${captainName}</strong>,</p>
          <p>Thank you for registering your team <strong>${teamName}</strong> for <strong>${tournamentName}</strong>!</p>
          
          <div style="background-color: #171a1f; border: 1px solid #00d2ff; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 5px 0;"><strong>Registration Ticket ID:</strong> <span style="color: #ff4655;">${ticketId}</span></p>
            <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
            <p style="margin: 5px 0;"><strong>Captain Name:</strong> ${captainName}</p>
            <p style="margin: 5px 0;"><strong>Payment Transaction UTR:</strong> ${transactionId}</p>
            <p style="margin: 5px 0;"><strong>Payment Verification Status:</strong> Pending Verification</p>
          </div>

          <p>Our tournament organizers will verify your transaction ref and release custom Room ID & Password prior to match start time.</p>

          <p style="margin-top: 25px;">
            <a href="https://discord.gg/2hpWdw4G" style="background-color: #5865F2; color: white; padding: 10px 18px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Join ARISE Discord Server →
            </a>
          </p>

          <hr style="border: 0; border-top: 1px solid #2a2f38; margin-top: 30px;" />
          <p style="font-size: 11px; color: #888;">
            ARISE Esports Community · Support Email: arisesports13@gmail.com
          </p>
        </div>
      `
    };

    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email sent to ${captainEmail} from arisesports13@gmail.com`);
    } else {
      console.log(`ℹ️ Email payload logged for ${captainEmail}. (Set EMAIL_PASS in server/.env to send via Gmail SMTP)`);
    }
  } catch (error) {
    console.error(`⚠️ Email sending notice: ${error.message}`);
  }
};

module.exports = sendRegistrationEmail;
