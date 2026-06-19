import nodemailer from 'nodemailer'

/**
 * Create transporter — gracefully degrades if credentials missing
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    // Return null to signal email is not configured
    return null
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  })
}

/**
 * Send an email — silently logs if not configured
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter()

  if (!transporter) {
    console.log(`[Email - NOT CONFIGURED] To: ${to} | Subject: ${subject}`)
    return { success: false, reason: 'Email not configured' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'LoanSunami <noreply@loansunami.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    })
    console.log(`[Email] Sent to ${to} | Message ID: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`[Email Error] Failed to send to ${to}:`, error.message)
    return { success: false, reason: error.message }
  }
}

/**
 * Email template: Lead submission confirmation to applicant
 */
export const leadConfirmationEmail = (lead) => ({
  to: lead.email,
  subject: 'Application Received — LoanSunami',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; color: #0d0d0d; }
        .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
        .header { background: #0a0a0a; padding: 32px 40px; text-align: center; }
        .logo { font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.04em; }
        .logo span { color: #c8f542; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
        .text { font-size: 15px; color: #555555; line-height: 1.65; margin-bottom: 20px; }
        .summary { background: #f9f9f9; border-radius: 14px; padding: 24px; margin: 24px 0; }
        .summary-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .summary-row:last-child { border-bottom: none; }
        .label { color: #888888; }
        .value { font-weight: 600; color: #0a0a0a; }
        .cta { display: inline-block; background: #0a0a0a; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 100px; font-weight: 600; font-size: 15px; margin: 8px 0; }
        .footer { background: #f5f5f5; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaaaaa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Loan<span>Sunami</span></div>
        </div>
        <div class="body">
          <div class="greeting">Application Received! 🎉</div>
          <p class="text">
            Hi <strong>${lead.firstName}</strong>, we've successfully received your loan application. 
            Our specialist will review your details and reach out within <strong>24 hours</strong>.
          </p>
          <div class="summary">
            <div class="summary-row">
              <span class="label">Name</span>
              <span class="value">${lead.firstName} ${lead.lastName}</span>
            </div>
            <div class="summary-row">
              <span class="label">Loan Amount</span>
              <span class="value">₹${Number(lead.loanAmount).toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span class="label">Purpose</span>
              <span class="value">${lead.loanPurpose || 'Not specified'}</span>
            </div>
            <div class="summary-row">
              <span class="label">Phone</span>
              <span class="value">${lead.phone}</span>
            </div>
          </div>
          <p class="text">In the meantime, use our calculators to plan your EMI and repayment schedule.</p>
        </div>
        <div class="footer">
          © 2026 LoanSunami Financial Pvt. Ltd. · All rights reserved<br/>
          This is an automated confirmation. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `,
})

/**
 * Email template: Admin notification on new lead
 */
export const adminNewLeadEmail = (lead) => ({
  to: process.env.ADMIN_EMAIL,
  subject: `🔔 New Lead: ${lead.firstName} ${lead.lastName} — ₹${Number(lead.loanAmount).toLocaleString('en-IN')}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .header { background: #0a0a0a; padding: 24px 32px; }
        .header h2 { color: #c8f542; margin: 0; font-size: 18px; }
        .header p { color: #555; margin: 4px 0 0; font-size: 13px; }
        .body { padding: 28px 32px; }
        .badge { display: inline-block; background: #f3fdc8; color: #65a30d; border: 1px solid #c8f542; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px 0; font-size: 14px; border-bottom: 1px solid #f5f5f5; vertical-align: top; }
        .lbl { color: #888; width: 40%; }
        .val { font-weight: 600; color: #0a0a0a; }
        .footer { background: #fafafa; padding: 16px 32px; text-align: center; font-size: 12px; color: #aaa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Lead Received</h2>
          <p>Submitted ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <div class="body">
          <div class="badge">NEW</div>
          <table>
            <tr><td class="lbl">Name</td><td class="val">${lead.firstName} ${lead.lastName}</td></tr>
            <tr><td class="lbl">Email</td><td class="val">${lead.email}</td></tr>
            <tr><td class="lbl">Phone</td><td class="val">${lead.phone}</td></tr>
            <tr><td class="lbl">Loan Amount</td><td class="val">₹${Number(lead.loanAmount).toLocaleString('en-IN')}</td></tr>
            <tr><td class="lbl">Purpose</td><td class="val">${lead.loanPurpose || '—'}</td></tr>
            <tr><td class="lbl">Employment</td><td class="val">${lead.employmentType || '—'}</td></tr>
            <tr><td class="lbl">Monthly Income</td><td class="val">${lead.monthlyIncome ? '₹' + Number(lead.monthlyIncome).toLocaleString('en-IN') : '—'}</td></tr>
            <tr><td class="lbl">Credit Score</td><td class="val">${lead.creditScore || '—'}</td></tr>
            <tr><td class="lbl">Property Location</td><td class="val">${lead.propertyLocation || '—'}</td></tr>
            <tr><td class="lbl">Tenure</td><td class="val">${lead.tenure || '—'}</td></tr>
          </table>
        </div>
        <div class="footer">LoanSunami Admin · Review in dashboard</div>
      </div>
    </body>
    </html>
  `,
})
