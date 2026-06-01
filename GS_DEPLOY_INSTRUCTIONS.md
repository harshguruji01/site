Google Apps Script (GAS) Sync Prototype

This file explains how to deploy the provided `gs-sync.gs` script as a Web App and obtain an endpoint (`GS_ENDPOINT`) that the site can use to sync users and newsletter subscribers.

Quick steps:

1. Open script.google.com and create a new project.
2. Copy the contents of `gs-sync.gs` into the Code.gs file.
3. Save the project and give it a name (e.g., WebGuruJi Sync).
4. From the left menu choose "Deploy" → "New deployment".
   - Select "Web app".
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy" and authorize the script.
5. After deployment, copy the Web App URL; this is your `GS_ENDPOINT`.

Client integration:
- In `auth.js` (already updated), set `window.GS_ENDPOINT = 'PASTE_YOUR_WEBAPP_URL_HERE';`
- The client will call GET `?action=getUser&email=...` to fetch remote users and POST JSON with `{action:'saveUser', user: {...}}` to save users.

Security & Notes:
- This prototype stores all user data in Script Properties — not secure for production. Use a proper database (Cloud Firestore, Cloud SQL) and authenticated endpoints for real deployments.
- Do NOT deploy this with real user passwords unless you secure the endpoint and use HTTPS (GAS uses HTTPS). For production, always implement server-side password hashing/salting and use secure authentication tokens.

Example client payload for saveUser (POST JSON):
{
  "action": "saveUser",
  "user": {
    "id": 123,
    "name": "Harsh",
    "email": "harsh@example.com",
    "mobile": "9123456789",
    "passwordHash": "...",
    "profilePicture": null
  }
}

If you want, I can (A) deploy this for you if you give me a Google account auth (not recommended); or (B) generate instructions to connect to Firebase instead (more scalable, secure).