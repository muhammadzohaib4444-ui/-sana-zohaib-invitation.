# Sana & Zohaib — Invitation (with secure personalized links)

## What changed
- `index.html` — the invitation itself. Guest name is now resolved by a
  server-side lookup (`/invite/TOKEN`), not read from the URL directly.
  The old "Invite someone by name" section is gone from this page.
- `admin.html` — host-only page to generate invite links. Not linked from
  anywhere on the public site.
- `netlify/functions/create-invite.js` — checks the admin password
  (server-side, every call) and creates a random token → guest name mapping.
- `netlify/functions/get-invite.js` — public, read-only: given a token,
  returns the guest name. Returns 404 for any unknown/tampered token.
- `netlify.toml` — routes `/invite/*` to the invitation page and
  `/admin` to the admin page.

This is now a **static + serverless** site, not a single HTML file — it
needs to be deployed with Netlify CLI or a connected Git repo, not
drag-and-drop, because the functions have a dependency (`@netlify/blobs`)
that needs to be installed and bundled.

## One-time setup

1. Install the Netlify CLI if you don't have it:
   ```
   npm install -g netlify-cli
   ```
2. From inside this folder:
   ```
   npm install
   netlify link      # connect to your existing sanaandzohaib.netlify.app site
   ```
3. Set your admin password as an environment variable (never put this in
   the code):
   ```
   netlify env:set ADMIN_PASSWORD "choose-a-strong-password"
   ```
4. Deploy:
   ```
   netlify deploy --prod
   ```

If you'd rather deploy by connecting this folder to a GitHub repo and
letting Netlify auto-build on push, that works too — just set
`ADMIN_PASSWORD` in Site settings → Environment variables first.

## Using it

- Go to `https://sanaandzohaib.netlify.app/admin`, enter the admin
  password and a guest name (e.g. "Sana & Family"), and click
  **Generate link**. You'll get something like:
  `https://sanaandzohaib.netlify.app/invite/8f72k9xQpR1`
- Send that link to that guest. When they open it, their name appears
  automatically. They have no way to edit it, and changing the token in
  the URL to a guessed or made-up value just shows the generic default —
  it will never reveal another guest's name, because the mapping only
  exists server-side.
- The plain `https://sanaandzohaib.netlify.app/` link (no token) still
  works and shows the generic "Our Honoured Guest" — useful for a QR
  code on a general invite, WhatsApp group, etc.
