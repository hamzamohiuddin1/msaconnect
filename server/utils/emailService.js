const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// // Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate confirmation token
const generateConfirmationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send confirmation email
const sendConfirmationEmail = async (email, token, name) => {
  try {
    // Log API key status (first 10 chars only for security)
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SENDGRID_API_KEY is not set!');
      throw new Error('SendGrid API key is not configured');
    }
    console.log('SendGrid API key starts with:', apiKey.substring(0, 10));
    
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
    console.log('Sending confirmation email to:', email);
    console.log('Confirmation URL:', confirmationUrl);
    
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

    const result = await sgMail.send(msg);
    console.log('SendGrid response status:', result[0]?.statusCode);
    console.log('Confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('SendGrid error response:', JSON.stringify(error.response.body, null, 2));
    }
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = {
  generateConfirmationToken,
  sendConfirmationEmail
};