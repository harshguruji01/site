import { Request, Response } from 'express';
import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export const contactController = {
  submit: async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
      }

      // Send the contact form submission to the admin
      const emailRes = await resend.emails.send({
        from: 'HarshGuruJi Contact <onboarding@resend.dev>',
        to: 'harshguruji01@gmail.com', // Always goes to your verified email
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3 style="color: #555;">Message:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 4px; color: #333; line-height: 1.5; white-space: pre-wrap;">${message}</p>
          </div>
        `,
        replyTo: email // Allows you to directly hit "reply" in your inbox to reply to the user
      });

      return res.status(200).json({ success: true, message: 'Message sent successfully!', data: emailRes });
    } catch (error: any) {
      console.error('Contact submission error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }
};
