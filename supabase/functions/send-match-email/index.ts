import { rollNumberToEmail } from '../../../src/utils/validation.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailRequest {
  roll1: string;
  roll2: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { roll1, roll2 }: EmailRequest = await req.json();
    
    if (!roll1 || !roll2) {
      return new Response(
        JSON.stringify({ error: 'Both roll numbers are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Convert roll numbers to emails
    const email1 = rollNumberToEmail(roll1);
    const email2 = rollNumberToEmail(roll2);

    // Email content
    const subject = 'Course Swap Match Found';
    const getEmailBody = (recipientRoll: string, counterpartRoll: string) => `
Dear Student,

Great news! We found a course swap match for you.

Your Details:
Roll Number: ${recipientRoll}
Email: ${rollNumberToEmail(recipientRoll)}

Match Details:
Counterpart Roll Number: ${counterpartRoll}
Counterpart Email: ${rollNumberToEmail(counterpartRoll)}

Next Steps:
1. Contact your counterpart directly via email or in person
2. Coordinate the section swap with your respective course instructors
3. Ensure both parties complete the swap process

This is an automated message from the Course Section Swap Finder system.

Best regards,
Course Swap System
`;

    // In a real implementation, you would integrate with an email service like:
    // - Supabase Edge Functions with a service like Resend
    // - SendGrid API
    // - AWS SES
    // - Nodemailer with SMTP
    
    // For this demo, we'll simulate sending emails
    console.log('Sending email to:', email1);
    console.log('Subject:', subject);
    console.log('Body:', getEmailBody(roll1, roll2));
    
    console.log('Sending email to:', email2);
    console.log('Subject:', subject);
    console.log('Body:', getEmailBody(roll2, roll1));

    // Simulate email sending success
    // In production, replace this with actual email sending logic
    const emailResults = {
      email1: { success: true, email: email1 },
      email2: { success: true, email: email2 },
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Match notifications sent successfully',
        results: emailResults
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error sending match notification:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send match notification',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});