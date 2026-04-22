import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req:Request) {
  try{
    const {token,password}=await req.json();
    if(!token || !password){
      return new Response(JSON.stringify({message:"Token and password are required"}),{status:400});
    }
    const user=await prisma.user.findFirst({where:{resetToken:token}});
    if(!user){
      return new Response(JSON.stringify({message:"Invalid token"}),{status:400});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await prisma.user.update({
      where:{id:user.id},
      data:{
        password:hashedPassword,
        resetToken:null,
      }
    });
    return new Response(JSON.stringify({message:"Password reset successfully"}),{status:200});
  } catch (error) {
    return new Response(JSON.stringify({message:"Internal server error"}),{status:500});

  }
}