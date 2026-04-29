import { resend } from "@/lib/resend";

export const emailFrom =
  process.env.EMAIL_FROM || "Offwhite Atelier <onboarding@resend.dev>";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!to) {
    throw new Error("Email recipient is required");
  }
  console.log(`Sending email to ${to} with subject "${subject}"`);

  const result = await resend.emails.send({
    from: emailFrom,
    to,
    subject,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}
