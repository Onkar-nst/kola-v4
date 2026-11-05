import nodemailer from "nodemailer";

/* ── Limits ──────────────────────────────────────────────────────────────── */
const LIMITS = { fullName: 100, email: 254, companyName: 150, message: 5000 };
const MIN_MESSAGE_LENGTH = 10;

/* Simple per-instance rate limit: 5 submissions per IP per 10 minutes.
   Serverless instances are recycled, so this slows abuse rather than
   guaranteeing a hard cap. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?kolacommunications\.com$/,
  /^https:\/\/kola-new-temp-anmol(-[a-z0-9-]+)?\.vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/\[::1?\](:\d+)?$/,
];

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const URL_RE = /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i;

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* Remove control characters (incl. CR/LF) from single-line fields */
const oneLine = (str) => String(str).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

const clientIp = (req) => {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim() || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
};

const isAllowedOrigin = (req) => {
  const origin = req.headers.origin || "";
  if (!origin) {
    // Some browsers omit Origin on same-origin POSTs; fall back to Referer
    const referer = req.headers.referer || "";
    if (!referer) return false;
    try {
      return ALLOWED_ORIGINS.some((re) => re.test(new URL(referer).origin));
    } catch {
      return false;
    }
  }
  return ALLOWED_ORIGINS.some((re) => re.test(origin));
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: real visitors never see or fill this field. Pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return res.status(200).json({ success: true });
  }

  const fullName = oneLine(body.fullName ?? "");
  const email = oneLine(body.email ?? "").toLowerCase();
  const companyName = oneLine(body.companyName ?? "");
  const message = String(body.message ?? "").trim();

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (
    fullName.length > LIMITS.fullName ||
    email.length > LIMITS.email ||
    companyName.length > LIMITS.companyName ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ error: "One or more fields are too long" });
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "Message is too short" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  // Names and company names never legitimately contain links
  if (URL_RE.test(fullName) || URL_RE.test(companyName)) {
    return res.status(400).json({ error: "Invalid name" });
  }

  if (isRateLimited(clientIp(req))) {
    res.setHeader("Retry-After", String(RATE_WINDOW_MS / 1000));
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Contact form: EMAIL_USER / EMAIL_PASS not configured");
    return res.status(500).json({ error: "Failed to send email." });
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

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeCompany = companyName ? escapeHtml(companyName) : "Not provided";
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
    const safeFirstName = escapeHtml(fullName.split(" ")[0]);
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
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#1e1b4b;font-weight:500;text-align:right;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#6b7280;">Email</td>
                <td style="padding:12px 0;border-bottom:1px solid #e0ddf5;font-size:14px;color:#4f46e5;font-weight:500;text-align:right;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;font-size:14px;color:#6b7280;">Company</td>
                <td style="padding:12px 0;font-size:14px;color:#1e1b4b;font-weight:500;text-align:right;">${safeCompany}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:20px 40px;">
            <div style="background:#f5f3ff;border-radius:10px;padding:18px 20px;border:1px solid #ddd6fe;">
              <p style="margin:0 0 8px;font-size:11px;color:#818cf8;letter-spacing:1px;text-transform:uppercase;">Message</p>
              <p style="margin:0;font-size:14px;color:#374151;line-height:1.75;">${safeMessage}</p>
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
    // Deliberately does NOT echo the visitor's message back: echoing it would
    // let anyone use this form to send arbitrary text from our mailbox to any
    // address they type in.
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

            <p style="margin:0 0 20px;font-size:22px;font-weight:500;color:#1e1b4b;">Hi ${safeFirstName},</p>

            <p style="margin:0 0 14px;font-size:14px;color:#4b5563;line-height:1.75;">
              Thank you for reaching out to <strong style="color:#4f46e5;font-weight:500;">Kola Communications</strong>. We've received your message and truly appreciate you taking the time to connect with us.
            </p>

            <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.75;">
              Our team will review your inquiry and get back to you within <strong style="color:#4f46e5;font-weight:500;">24 hours</strong>.
            </p>

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
      subject: `New Inquiry from ${fullName}${companyName ? ` — ${companyName}` : ""}`.slice(0, 200),
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
