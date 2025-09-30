const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate confirmation token
const generateConfirmationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send confirmation email
const sendConfirmationEmail = async (email, token, name) => {
  try {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    
    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_USER || 'noreply@msaconnect.com',
        name: 'MSAConnect'
      },
      subject: 'MSAConnect - Confirm Your Email Address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin-bottom: 10px;">MSAConnect</h1>
            <p style="color: #d4af37; font-size: 18px; margin: 0;">Muslim Student Association</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #1e40af;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">Welcome to MSAConnect, ${name}!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining MSAConnect! We're excited to help you connect with your fellow Muslim students at UCSD.
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 30px;">
              To complete your registration, please confirm your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${confirmationUrl}" 
                 style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${confirmationUrl}" style="color: #1e40af; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>MSAConnect - Connecting the Muslim Student Community at UCSD</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('Confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = {
  generateConfirmationToken,
  sendConfirmationEmail
};