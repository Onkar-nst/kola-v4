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
  host: "smtp.hostinger.com",
  port: 465, 
  secure: true, 
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

    // ── ADMIN EMAIL ────────────────────────────────────────────────────────────
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f3f4f9;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" style="padding:48px 20px;">
    <tr><td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e0ddf5;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#818cf8 100%);padding:36px 40px 32px;">
            <p style="margin:0;font-size:22px;font-weight:600;letter-spacing:4px;color:#ffffff;">KOLA</p>
            <p style="margin:4px 0 0;font-size:11px;color:#c7d2fe;letter-spacing:1px;">Communications</p>
            <p style="margin:24px 0 0;font-size:20px;font-weight:500;color:#ffffff;line-height:1.4;">
              New inquiry <span style="color:#a5b4fc;">received</span>
            </p>
          </td>
        </tr>

        <!-- Sender details -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:500;letter-spacing:1.2px;color:#818cf8;text-transform:uppercase;">Sender details</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#6b7280;width:120px;">Full name</td>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#1e1b4b;font-weight:500;text-align:right;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#6b7280;">Email</td>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#4f46e5;font-weight:500;text-align:right;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;font-size:14px;color:#6b7280;">Company</td>
                <td style="padding:12px 0;font-size:14px;color:#1e1b4b;font-weight:500;text-align:right;">${companyName || "Not provided"}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:20px 40px;">
            <div style="background:#f5f3ff;border-radius:10px;padding:18px 20px;border:1px solid #ddd6fe;">
              <p style="margin:0 0 8px;font-size:11px;color:#818cf8;letter-spacing:1px;text-transform:uppercase;">Message</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.75;">${message}</p>
            </div>
          </td>
        </tr>

        <!-- Timestamp -->
        <tr>
          <td style="padding:0 40px 28px;">
            <span style="display:inline-flex;align-items:center;gap:6px;background:#eef2ff;color:#4f46e5;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:500;border:1px solid #c7d2fe;">
              &#9679;&nbsp; Submitted — ${submittedAt}
            </span>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f3ff;padding:16px 40px;border-top:1px solid #ddd6fe;">
            <table width="100%">
              <tr>
                <td style="font-size:11px;font-weight:500;color:#6366f1;letter-spacing:1px;">KOLA</td>
                <td style="font-size:12px;color:#a5afc7;text-align:right;">© ${year} Kola Communications</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ── AUTO-REPLY EMAIL ───────────────────────────────────────────────────────
    const autoReplyHtml = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f3f4f9;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" style="padding:48px 20px;">
    <tr><td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e0ddf5;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#818cf8 100%);padding:36px 40px 32px;">
            <p style="margin:0;font-size:22px;font-weight:600;letter-spacing:4px;color:#ffffff;">KOLA</p>
            <p style="margin:4px 0 0;font-size:11px;color:#c7d2fe;letter-spacing:1px;">Communications</p>
            <p style="margin:24px 0 0;font-size:20px;font-weight:500;color:#ffffff;line-height:1.4;">
              We've got <span style="color:#a5b4fc;">your message</span>
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px 28px;">

            <p style="margin:0 0 20px;font-size:22px;font-weight:500;color:#1e1b4b;">Hi ${firstName},</p>

            <p style="margin:0 0 14px;font-size:14px;color:#4b5563;line-height:1.75;">
              Thank you for reaching out to <strong style="color:#4f46e5;font-weight:500;">Kola Communications</strong>. We've received your message and truly appreciate you taking the time to connect with us.
            </p>

            <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.75;">
              Our team will review your inquiry and get back to you within <strong style="color:#4f46e5;font-weight:500;">24 hours</strong>.
            </p>

            <!-- Message recap -->
            <div style="background:#f5f3ff;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 20px;">
              <p style="margin:0 0 8px;font-size:11px;color:#818cf8;letter-spacing:1px;text-transform:uppercase;">Your message</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.75;">${message}</p>
            </div>

            <p style="margin:0 0 28px;font-size:14px;color:#4b5563;line-height:1.75;">
              If your request is urgent, feel free to reply directly to this email — we're happy to help.
            </p>

            <hr style="border:none;border-top:1px solid #e0ddf5;margin:0 0 20px;" />

            <p style="margin:0;font-size:14px;font-weight:500;color:#1e1b4b;">Kola Communications Team</p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f3ff;padding:16px 40px;border-top:1px solid #ddd6fe;">
            <table width="100%">
              <tr>
                <td style="font-size:11px;font-weight:500;color:#6366f1;letter-spacing:1px;">KOLA</td>
                <td style="font-size:12px;color:#a5afc7;text-align:right;">© ${year} Kola Communications</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send admin email
    await transporter.sendMail({
      from: `"Kola Communications" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Inquiry from ${fullName}${companyName ? ` — ${companyName}` : ""}`,
      html: adminHtml,
    });

    // Send auto-reply
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