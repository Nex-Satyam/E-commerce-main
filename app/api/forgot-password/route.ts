import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(req:Request) {
  try{
    const {email}=await req.json();
    if(!email){
      return new Response(JSON.stringify({message:"Email is required"}),{status:400});
    }
    const user=await prisma.user.findUnique({where:{email}});
    if(!user){
      return new Response(JSON.stringify({message:"User not found"}),{status:404});
    }
    const resetToken=crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where:{email},
      data:{resetToken}
    });
    await resend.emails.send({
      from:"E-commerce App <no-reply@ecommerce.com>",
      to:email,
      subject:"Password Reset",
      html:`<p>Click <a href="http://localhost:3000/reset?token=${resetToken}">Reset</a> to reset your password</p>`
    });
    return new Response(JSON.stringify({message:"Password reset email sent"}),{status:200});
  } catch (error) {
    return new Response(JSON.stringify({message:"Internal server error"}),{status:500});
  }
}