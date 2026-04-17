import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fullName, email, companyName, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const submittedAt = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const firstName = fullName.split(" ")[0];
    const year = new Date().getFullYear();

    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0f5;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0f5;padding:48px 20px;">
    <tr><td align="center">

      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(60,60,160,0.08);">

        <!-- Header -->
        <tr>
          <td style="padding:40px 48px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:20px;font-weight:500;color:#1a1a2e;letter-spacing:3px;text-transform:uppercase;">KOLA</p>
                  <p style="margin:3px 0 0;font-size:11px;color:#9090a8;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Communications</p>
                </td>
                <td style="text-align:right;vertical-align:top;">
                  <span style="display:inline-block;background:#f0f0f8;border-radius:20px;padding:6px 14px;font-size:11px;color:#5050b8;font-weight:500;letter-spacing:0.5px;">New Inquiry</span>
                </td>
              </tr>
            </table>
            <div style="margin-top:28px;height:1px;background:#ebebf5;"></div>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:8px 48px 32px;">
            <h2 style="margin:0 0 10px;font-size:22px;font-weight:500;color:#1a1a2e;letter-spacing:-0.3px;line-height:1.3;">You have a new message</h2>
            <p style="margin:0;font-size:14px;color:#7070a0;line-height:1.7;font-weight:400;">Someone submitted your contact form on kolacommunications.com.</p>
          </td>
        </tr>

        <!-- Info rows -->
        <tr>
          <td style="padding:0 48px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#f7f7fc;border-radius:10px 10px 0 0;padding:16px 20px;border-bottom:1px solid #ebebf5;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:500;color:#9090b8;letter-spacing:1.8px;text-transform:uppercase;">Full Name</p>
                  <p style="margin:0;font-size:15px;color:#1a1a2e;font-weight:400;">${fullName}</p>
                </td>
              </tr>
              <tr>
                <td style="background:#f7f7fc;padding:16px 20px;border-bottom:1px solid #ebebf5;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:500;color:#9090b8;letter-spacing:1.8px;text-transform:uppercase;">Email Address</p>
                  <a href="mailto:${email}" style="font-size:15px;color:#4040b8;font-weight:400;text-decoration:none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="background:#f7f7fc;border-radius:0 0 10px 10px;padding:16px 20px;">
                  <p style="margin:0 0 3px;font-size:10px;font-weight:500;color:#9090b8;letter-spacing:1.8px;text-transform:uppercase;">Company</p>
                  <p style="margin:0;font-size:15px;color:#1a1a2e;font-weight:400;">${companyName || "Not provided"}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:0 48px 36px;">
            <p style="margin:0 0 10px;font-size:10px;font-weight:500;color:#9090b8;letter-spacing:1.8px;text-transform:uppercase;">Message</p>
            <div style="background:#f7f7fc;border-radius:10px;padding:20px 22px;border-left:3px solid #3d3db4;">
              <p style="margin:0;font-size:14px;color:#3a3a5c;line-height:1.85;font-weight:400;white-space:pre-wrap;">${message}</p>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 48px 44px;">
            <a href="mailto:${email}?subject=Re%3A%20Your%20Inquiry&body=Hi%20${encodeURIComponent(firstName)}%2C%0A%0AThank%20you%20for%20reaching%20out!"
              style="display:inline-block;background:#3d3db4;color:#ffffff;font-size:13px;font-weight:500;text-decoration:none;padding:14px 30px;border-radius:8px;letter-spacing:0.3px;">
              Reply to ${firstName} &rarr;
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f7fc;border-top:1px solid #ebebf5;padding:22px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td><p style="margin:0;font-size:11px;color:#a0a0bc;font-weight:400;">Submitted &mdash; ${submittedAt}</p></td>
                <td style="text-align:right;"><p style="margin:0;font-size:11px;color:#c0c0d8;font-weight:400;">&copy; ${year} Kola Communications</p></td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

      <p style="margin:20px 0 0;font-size:11px;color:#b0b0c8;text-align:center;font-weight:400;">Automated notification from kolacommunications.com</p>

    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Kola Communications" <${process.env.EMAIL_USER}>`,
      to: "business@kolacommunications.com",
      replyTo: email,
      subject: `New Inquiry from ${fullName}${companyName ? ` — ${companyName}` : ""}`,
      html: htmlTemplate,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
}