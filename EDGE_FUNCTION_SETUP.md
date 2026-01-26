# Supabase Edge Function Setup Guide

This guide explains how to set up the email sending functionality for the membership form.

## Prerequisites

1. A Supabase account and project
2. A Resend account (free tier available at https://resend.com)
3. Supabase CLI installed (optional, for local development)

## Step 1: Get Resend API Key

1. Sign up for a free account at https://resend.com
2. Navigate to API Keys in your dashboard
3. Create a new API key
4. Copy the API key (you'll need it in Step 3)

## Step 2: Deploy the Edge Function

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Click "Create a new function"
4. Name it `send-membership-email`
5. Copy the contents of `supabase/functions/send-membership-email/index.ts` into the editor
6. Click "Deploy"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy send-membership-email
```

## Step 3: Set Environment Variables

### Using Supabase Dashboard:

1. Go to Edge Functions > Settings
2. Add the following secrets:
   - `RESEND_API_KEY`: Your Resend API key
   - `RECIPIENT_EMAIL`: antonclaeysoone@icloud.com (or leave default)

### Using Supabase CLI:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
supabase secrets set RECIPIENT_EMAIL=antonclaeysoone@icloud.com
```

## Step 4: Update Domain in Resend

1. In your Resend dashboard, go to Domains
2. Add and verify your domain (e.g., sisera.be)
3. Update the `from` email in the function to use your verified domain

Alternatively, you can use Resend's test domain for development:
- Change `from: 'SISERA Business Club <noreply@sisera.be>'` 
- To: `from: 'SISERA Business Club <onboarding@resend.dev>'`

## Step 5: Test the Function

You can test the function using the Supabase dashboard or by submitting the form on your website.

## Alternative Email Services

If you prefer to use a different email service, you can modify the Edge Function:

### SendGrid:
```typescript
const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: RECIPIENT_EMAIL }],
    }],
    from: { email: 'noreply@sisera.be', name: 'SISERA Business Club' },
    subject: `Nieuwe Lidmaatschap Aanvraag: ${membershipData.name}`,
    content: [{
      type: 'text/html',
      value: emailBody,
    }],
    reply_to: { email: membershipData.email },
  }),
});
```

### Mailgun:
```typescript
const formData = new FormData();
formData.append('from', 'SISERA Business Club <noreply@sisera.be>');
formData.append('to', RECIPIENT_EMAIL);
formData.append('subject', `Nieuwe Lidmaatschap Aanvraag: ${membershipData.name}`);
formData.append('html', emailBody);
formData.append('h:Reply-To', membershipData.email);

const mailgunResponse = await fetch(
  `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
    },
    body: formData,
  }
);
```

## Troubleshooting

- **Function not found**: Make sure the function is deployed and the name matches exactly
- **Email not sending**: Check that your API key is correct and your Resend account is verified
- **CORS errors**: The function includes CORS headers, but make sure your Supabase project allows the requests
- **Domain verification**: For production, you need to verify your sending domain in Resend



