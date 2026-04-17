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

    // ✅ INDIAN TIME FIX
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

    // ✅ ADMIN EMAIL (ORIGINAL KOLA UI — UNCHANGED)
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f0f0f5;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" style="padding:48px 20px;">
    <tr><td align="center">

      <table width="600" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(60,60,160,0.08);">

        <tr>
          <td style="padding:40px 48px 28px;">
            <p style="font-size:20px;font-weight:500;letter-spacing:3px;">KOLA</p>
            <p style="font-size:11px;color:#9090a8;">Communications</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <h2>You have a new message</h2>
            <p>Someone submitted your contact form.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px;">
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Company:</b> ${companyName || "Not provided"}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 48px;">
            <div style="background:#f7f7fc;padding:15px;border-radius:10px;">
              ${message}
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 48px;font-size:12px;color:#888;">
            Submitted — ${submittedAt}<br/>
            © ${year} Kola Communications
          </td>
        </tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;

    // ✅ AUTO REPLY (PROFESSIONAL)
    const autoReplyHtml = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f0f0f5;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" style="padding:48px 20px;">
    <tr><td align="center">

      <table width="600" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(60,60,160,0.08);">

        <tr>
          <td style="padding:40px 48px 28px;">
            <p style="font-size:20px;font-weight:500;letter-spacing:3px;">KOLA</p>
            <p style="font-size:11px;color:#9090a8;">Communications</p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <h2>Hi ${firstName},</h2>

            <p style="color:#555;line-height:1.7;">
              Thank you for reaching out to <b>Kola Communications</b>.
            </p>

            <p style="color:#555;line-height:1.7;">
              We’ve received your message and our team will get back to you within <b>24 hours</b>.
            </p>

            <div style="margin-top:20px;padding:15px;background:#f7f7fc;border-radius:10px;">
              <p style="margin:0 0 5px;font-size:12px;color:#9090a8;">Your Message</p>
              <p style="margin:0;">${message}</p>
            </div>

            <p style="margin-top:20px;color:#555;">
              If your request is urgent, feel free to reply to this email.
            </p>

            <p style="margin-top:20px;">
              Best regards,<br/>
              <b>Kola Communications Team</b>
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 48px;font-size:12px;color:#888;">
            © ${year} Kola Communications
          </td>
        </tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;

    // 🔥 1. SEND ADMIN EMAIL
    await transporter.sendMail({
      from: `"Kola Communications" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Inquiry from ${fullName}${companyName ? ` — ${companyName}` : ""}`,
      html: adminHtml,
    });

    // 🔥 2. SEND AUTO REPLY
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