const { Resend } = require('resend');

// Initialize Resend with your API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  // Basic Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const data = await resend.emails.send({
      from: 'E-Learning Contact <onboarding@resend.dev>',
      to: 'baralanupam111@gmail.com', // Put YOUR email here
      subject: `New Inquiry from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "Email sent!", data });
  } catch (error) {
    console.error("Resend Error:", error);
    return res.status(500).json({ success: false, error: "Failed to send email" });
  }
};

module.exports = { sendContactEmail };