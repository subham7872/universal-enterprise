import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Send an email via Brevo REST API with automatic SMTP fallback
 */
export async function sendEmail({ to, subject, htmlContent, textContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ue14.email@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Universal Enterprise';

  const recipientList = Array.isArray(to) ? to : [{ email: to.email || to, name: to.name || 'Recipient' }];

  // 1. Try Brevo HTTP REST API
  if (apiKey && !apiKey.startsWith('your_')) {
    try {
      const res = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: recipientList,
          subject,
          htmlContent: htmlContent || `<p>${textContent || ''}</p>`,
          textContent: textContent || ''
        })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('[Brevo Email Success] Sent messageId:', data.messageId, 'to:', recipientList);
        return { success: true, messageId: data.messageId, engine: 'api' };
      }

      if (res.status === 401 && data.message && data.message.includes('authorised_ips')) {
        console.warn('[Brevo Email Notice]: Your Brevo account requires IP Authorization. Please visit https://app.brevo.com/security/authorised_ips to authorize or toggle off IP restrictions.');
      } else {
        console.warn('[Brevo Email API Warning]', res.status, data);
      }
    } catch (apiErr) {
      console.warn('[Brevo Email API Error]', apiErr.message);
    }
  }

  // 2. Fallback to Brevo SMTP Relay via nodemailer
  const smtpKey = process.env.BREVO_SMTP_KEY;
  const smtpLogin = process.env.BREVO_SMTP_LOGIN || 'b74cc9001@smtp-brevo.com';

  if (smtpKey && !smtpKey.startsWith('your_')) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com',
        port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
        auth: {
          user: smtpLogin,
          pass: smtpKey
        }
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipientList.map(r => (r.name ? `"${r.name}" <${r.email}>` : r.email)).join(', '),
        subject,
        html: htmlContent,
        text: textContent
      });

      console.log('[Brevo SMTP Success] Sent messageId:', info.messageId);
      return { success: true, messageId: info.messageId, engine: 'smtp' };
    } catch (smtpErr) {
      console.warn('[Brevo SMTP Error]:', smtpErr.message);
      return { success: false, error: smtpErr.message };
    }
  }

  return { success: false, reason: 'NO_VALID_EMAIL_CREDENTIALS' };
}

/**
 * Send alert to Universal Enterprise owner regarding a new lead
 */
export async function sendOwnerAlert(leadData) {
  const ownerEmail = process.env.OWNER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'ue14.email@gmail.com';
  const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const subject = `🔔 New Lead — Universal Enterprise [${leadData.name || 'Prospective Buyer'}]`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #003366; padding: 20px; text-align: center; border-bottom: 4px solid #f2cc4d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 0.5px;">UNIVERSAL ENTERPRISE</h1>
          <p style="color: #f2cc4d; margin: 4px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Lead Sourcing Alert Desk</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #003366; font-size: 16px; margin-top: 0;">New Industrial Sourcing Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 35%;">Buyer Name:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold;">${leadData.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email Address:</td>
              <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${leadData.email}" style="color: #003366; text-decoration: none;">${leadData.email || 'N/A'}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Contact Phone:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold;"><a href="tel:${leadData.phone || leadData.mobile}" style="color: #003366; text-decoration: none;">${leadData.phone || leadData.mobile || 'N/A'}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Company / Org:</td>
              <td style="padding: 10px 0; color: #0f172a;">${leadData.company || 'Website Portal Visitor'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Source Channel:</td>
              <td style="padding: 10px 0; color: #003366; font-weight: bold; text-transform: uppercase;">${leadData.source || 'Website Lead'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Inquiry / Message:</td>
              <td style="padding: 10px 0; color: #334155;">${leadData.message || leadData.productInterest || 'General Bearing Inquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Timestamp (IST):</td>
              <td style="padding: 10px 0; color: #64748b; font-family: monospace;">${nowIST}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/crm" style="background-color: #003366; color: #ffffff; padding: 12px 24px; font-size: 12px; font-weight: bold; text-decoration: none; border-radius: 4px; text-transform: uppercase; display: inline-block;">Open in CRM Portal &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: { email: ownerEmail, name: 'Universal Enterprise Admin' },
    subject,
    htmlContent,
    textContent: `New Lead: ${leadData.name} | Phone: ${leadData.phone || leadData.mobile} | Email: ${leadData.email} | Message: ${leadData.message || leadData.productInterest}`
  });
}

/**
 * Send automated confirmation email to the prospective customer
 */
export async function sendCustomerConfirmation(leadData) {
  if (!leadData.email) return { success: false, reason: 'NO_CUSTOMER_EMAIL' };

  const subject = `We received your enquiry — Universal Enterprise`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #003366; padding: 20px; text-align: center; border-bottom: 4px solid #f2cc4d;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 0.5px;">UNIVERSAL ENTERPRISE</h1>
          <p style="color: #f2cc4d; margin: 4px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Precision Bearings & Motion Engineering</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #0f172a; font-weight: bold;">Dear ${leadData.name || 'Valued Client'},</p>
          <p style="font-size: 13px; line-height: 1.6; color: #334155;">
            Thank you for contacting <strong>Universal Enterprise</strong>. We specialize in genuine, factory-certified precision industrial bearings, linear guides, machine tool spindles, and power transmission assemblies.
          </p>
          <div style="background-color: #f1f5f9; padding: 14px; border-left: 4px solid #003366; border-radius: 4px; margin: 16px 0; font-size: 12px; color: #1e293b;">
            <strong>Your Sourcing Details:</strong><br/>
            <strong>Product/Interest:</strong> ${leadData.message || leadData.productInterest || 'General Industrial Bearings'}<br/>
            <strong>Registered Contact:</strong> ${leadData.phone || leadData.mobile || leadData.email}
          </div>
          <p style="font-size: 13px; line-height: 1.6; color: #334155;">
            Our technical sourcing team will review your specifications and reach out within 24 hours. You may also receive a brief follow-up call from our AI engineering assistant <strong>Lily</strong> to coordinate quote requirements or schedule a consultation.
          </p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            <p style="margin: 0; font-weight: bold; color: #003366;">UNIVERSAL ENTERPRISE — Sourcing Desk</p>
            <p style="margin: 3px 0;">No. 7, 4th Cross, Kalasipalya New Extension, Bangalore – 560002, India</p>
            <p style="margin: 3px 0; color: #475569;">GST: 29AAGFU1019D1ZF</p>
            <p style="margin: 3px 0 0 0;">Phone: +91 9900726939 / 8123836939 | Email: ue14.email@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: { email: leadData.email, name: leadData.name || 'Customer' },
    subject,
    htmlContent,
    textContent: `Dear ${leadData.name},\nThank you for contacting Universal Enterprise. Our team will reach out within 24 hours.\n— Universal Enterprise Team`
  });
}

export default {
  sendEmail,
  sendOwnerAlert,
  sendCustomerConfirmation
};
