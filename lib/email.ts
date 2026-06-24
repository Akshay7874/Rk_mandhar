import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}

let config: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || '',
};

export function updateEmailConfig(newConfig: Partial<EmailConfig>) {
  config = { ...config, ...newConfig };
}

export function getEmailConfig(): EmailConfig {
  return { ...config };
}

const transporter = () => {
  if (!config.user || !config.pass) return null;
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

export async function sendNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const t = transporter();
  if (!t) {
    return { success: false, error: 'Email not configured' };
  }

  try {
    await t.sendMail({
      from: `"RK Mandhar Website" <${config.from}>`,
      to: config.to,
      subject: `New Inquiry from ${data.name} - ${data.productInterest}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            New Contact Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f0fdf4; width: 120px;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f0fdf4;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f0fdf4;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f0fdf4;">Product Interest</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.productInterest}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f0fdf4;">Message</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td>
            </tr>
          </table>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from RK Mandhar website contact form.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}
