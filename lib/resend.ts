import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}
console.log("Resend API Key loaded successfully");
console.log(`Resend API Key: ${process.env.RESEND_API_KEY.substring(0, 4)}...${process.env.RESEND_API_KEY.slice(-4)}`);

export const resend = new Resend(process.env.RESEND_API_KEY);
