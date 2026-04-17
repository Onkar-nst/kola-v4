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
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", 
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

        <tr>
          <td style="padding:40px 48px 28px;">
            <table width="100%">
              <tr>
                <td>
                  <p style="margin:0;font-size:20px;font-weight:500;color:#1a1a2e;letter-spacing:3px;text-transform:uppercase;">KOLA</p>
                  <p style="margin:3px 0 0;font-size:11px;color:#9090a8;">Communications</p>
                </td>
                <td style="text-align:right;">
                  <span style="background:#f0f0f8;border-radius:20px;padding:6px 14px;font-size:11px;color:#5050b8;">New Inquiry</span>
                </td>
              </tr>
            </table>
            <div style="margin-top:28px;height:1px;background:#ebebf5;"></div>
          </td>
        </tr>

        <tr>
          <td style="padding:8px 48px 32px;">
            <h2 style="margin:0 0 10px;">You have a new message</h2>
            <p>Someone submitted your contact form.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Company:</b> ${companyName || "Not provided"}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 36px;">
            <div style="background:#f7f7fc;padding:20px;border-radius:10px;">
              ${message}
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 44px;">
            <a href="mailto:${email}" style="background:#3d3db4;color:#fff;padding:10px 20px;border-radius:6px;">
              Reply to ${firstName}
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:22px 48px;font-size:12px;color:#aaa;">
            Submitted — ${submittedAt} <br/>
            © ${year} Kola Communications
          </td>
        </tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Kola Communications" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Inquiry from ${fullName}${companyName ? ` — ${companyName}` : ""}`,
      html: htmlTemplate,
    });

    const autoReplyHtml = htmlTemplate
      .replace("New Inquiry", "Confirmation")
      .replace(
        "You have a new message",
        `Hi ${firstName}, we’ve received your message`,
      )
      .replace(
        "Someone submitted your contact form.",
        "Thank you for reaching out to Kola Communications. We’ll get back to you shortly.",
      );

    await transporter.sendMail({
      from: `"Kola Communications" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: `We received your inquiry — Kola Communications`,
      html: autoReplyHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email." });
  }
}
