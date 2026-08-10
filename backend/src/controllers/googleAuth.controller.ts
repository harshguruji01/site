import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { env } from '../config/env';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

function getRedirectUri(): string {
  return env.GOOGLE_CALLBACK_URL || `${env.FRONTEND_URL}/api/auth/google/callback`;
}

export const googleAuthController = {
  /**
   * GET /api/auth/google
   * Redirects user to Google OAuth consent screen
   */
  async redirectToGoogle(req: Request, res: Response) {
    const clientId = env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google OAuth is not configured. Please contact the administrator.' 
      });
    }

    const redirectUri = getRedirectUri();
    const state = Buffer.from(JSON.stringify({ 
      nonce: Math.random().toString(36).substring(2),
      redirect: (req.query.redirect as string) || '/dashboard.html'
    })).toString('base64url');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state,
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  },

  /**
   * GET /api/auth/google/callback
   * Handles Google OAuth callback
   */
  async handleCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        return res.redirect('/login.html?error=oauth_denied');
      }

      if (!code) {
        return res.redirect('/login.html?error=missing_code');
      }

      // Parse state to get redirect URL
      let redirectTo = '/dashboard.html';
      if (state) {
        try {
          const stateData = JSON.parse(Buffer.from(state as string, 'base64url').toString());
          redirectTo = stateData.redirect || '/dashboard.html';
        } catch {
          // Invalid state, use default
        }
      }

      const clientId = env.GOOGLE_CLIENT_ID;
      const clientSecret = env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return res.redirect('/login.html?error=oauth_not_configured');
      }

      const redirectUri = getRedirectUri();

      // Exchange authorization code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Google token exchange failed:', errorText);
        return res.redirect('/login.html?error=token_exchange_failed');
      }

      const tokenData = await tokenResponse.json();

      // Get user info from Google
      const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        return res.redirect('/login.html?error=userinfo_failed');
      }

      const profile = await userInfoResponse.json();

      // Verify email is present
      if (!profile.email) {
        return res.redirect('/login.html?error=no_email');
      }

      // Create or update user in database
      const { token } = await authService.verifyGoogleUser({
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        picture: profile.picture,
        verified_email: profile.verified,
      });

      // Set JWT cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend
      res.redirect(redirectTo);
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      res.redirect('/login.html?error=server_error');
    }
  },
};