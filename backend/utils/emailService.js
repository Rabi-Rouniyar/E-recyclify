import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
  let transporter;

  // If the user hasn't set a real password yet, use Nodemailer's Ethereal to dynamically create a test account
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email_username' || process.env.EMAIL_PASS === 'ENTER_YOUR_APP_PASSWORD_HERE' || process.env.EMAIL_PASS === 'your_email_password') {
    console.log('Real SMTP password not found. Generating Ethereal test account for testing...');
    let testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    // Create a transporter using user's configuration
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || 'E-Recyclify'} <${process.env.FROM_EMAIL || 'noreply@e-recyclify.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Prefer HTML if provided
  };

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('----------------------------------------------------');
  console.log('EMAIL SENT SUCCESSFULLY: %s', info.messageId);
  
  // If we used Ethereal, log the preview URL so the user can view it in browser!
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email_username' || process.env.EMAIL_PASS === 'ENTER_YOUR_APP_PASSWORD_HERE' || process.env.EMAIL_PASS === 'your_email_password') {
    console.log('View the Email Preview Here: %s', nodemailer.getTestMessageUrl(info));
  }
  console.log('----------------------------------------------------');
};

export default sendEmail;
