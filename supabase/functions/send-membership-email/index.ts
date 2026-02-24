import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RECIPIENT_EMAIL = Deno.env.get('RECIPIENT_EMAIL') || 'johannes@sisera.be';

interface MembershipRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const membershipData: MembershipRequest = await req.json();

    // Validate required fields
    if (!membershipData.name || !membershipData.email || !membershipData.phone || !membershipData.company) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Send email using Resend API
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const emailBody = `
      <h2>Nieuwe Lidmaatschap Aanvraag</h2>
      <p>Er is een nieuwe aanvraag voor lidmaatschap van de SISERA Business Club ontvangen.</p>
      
      <h3>Contactgegevens:</h3>
      <ul>
        <li><strong>Naam:</strong> ${membershipData.name}</li>
        <li><strong>E-mail:</strong> ${membershipData.email}</li>
        <li><strong>Telefoon:</strong> ${membershipData.phone}</li>
        <li><strong>Bedrijf:</strong> ${membershipData.company}</li>
        ${membershipData.website ? `<li><strong>Website:</strong> ${membershipData.website}</li>` : ''}
      </ul>
      
      ${membershipData.message ? `
      <h3>Bericht:</h3>
      <p>${membershipData.message.replace(/\n/g, '<br>')}</p>
      ` : ''}
      
      <hr>
      <p style="color: #666; font-size: 12px;">Dit bericht is automatisch gegenereerd door het SISERA Business Club aanvraagsysteem.</p>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SISERA Business Club <noreply@sisera.be>',
        to: [RECIPIENT_EMAIL],
        subject: `Nieuwe Lidmaatschap Aanvraag: ${membershipData.name} - ${membershipData.company}`,
        html: emailBody,
        reply_to: membershipData.email,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${resendResponse.statusText}`);
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});



