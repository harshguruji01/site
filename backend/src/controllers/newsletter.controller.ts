import { Request, Response } from 'express';
import { Resend } from 'resend';
import { env } from '../config/env';

// Initialize with environment variable
const resend = new Resend(env.RESEND_API_KEY);

export const newsletterController = {
  subscribe: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // 1. Send Welcome Email to the Subscriber (Will work for all once domain is verified on Resend)
      // Note: On Resend free tier without a verified domain, this will only work if 'email' is the verified test email.
      const welcomeEmail = await resend.emails.send({
        from: 'HarshGuruJi <onboarding@resend.dev>', // Change to 'hello@yourdomain.com' after verification
        to: email, 
        subject: 'Welcome to HarshGuruJi Newsletter! 🚀',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px 20px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 10px;">Welcome to HarshGuruJi!</h1>
              <p style="color: #b3b3b3; font-size: 16px;">Your go-to place for simple, clear, and reliable learning.</p>
            </div>
            
            <div style="background: #0f0f0f; border: 1px solid rgba(255,255,255,0.08); padding: 30px; border-radius: 12px; margin-bottom: 30px;">
              <h2 style="color: #fff; font-size: 20px; margin-top: 0;">Hi there,</h2>
              <p style="color: #ccc; line-height: 1.6;">Congrats on sending your <strong>first email</strong> via Resend! Thank you for subscribing to our newsletter. You'll now receive daily insights, new tools, and educational content directly in your inbox.</p>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://webguruji.online" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Explore HarshGuruJi</a>
              </div>
            </div>
            
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>© 2026 HarshGuruJi. All rights reserved.</p>
              <p>You received this because you subscribed on our website.</p>
            </div>
          </div>
        `
      });

      // 2. Send Admin Notification Email to you
      const adminEmail = await resend.emails.send({
        from: 'System <onboarding@resend.dev>',
        to: 'harshguruji01@gmail.com', // Your email
        subject: '🎉 New Newsletter Subscriber!',
        html: `<p>Awesome news! A new user just subscribed to the newsletter.</p><p><strong>Subscriber Email:</strong> ${email}</p>`
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Subscribed successfully', 
        data: { welcome: welcomeEmail, admin: adminEmail } 
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }
};
